import os
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory

# Project folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Flask application
app = Flask(
    __name__,
    static_folder=BASE_DIR,
    static_url_path=""
)

# Database path
DATABASE = os.path.join(BASE_DIR, "timeflow.db")


# Database connection
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create database and table
def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS alarms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            target_time TEXT NOT NULL,
            triggered INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


# Dashboard
@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


# Other HTML pages
@app.route("/<path:filename>")
def serve_pages(filename):
    if filename.endswith(".html"):
        return send_from_directory(BASE_DIR, filename)

    return send_from_directory(BASE_DIR, filename)


# Get all alarms
@app.route("/api/alarms", methods=["GET"])
def get_alarms():

    conn = get_db()

    alarms = conn.execute(
        "SELECT * FROM alarms ORDER BY target_time"
    ).fetchall()

    conn.close()

    return jsonify([dict(alarm) for alarm in alarms])


# Add new alarm
@app.route("/api/alarms", methods=["POST"])
def add_alarm():

    data = request.get_json()

    if not data or not data.get("label") or not data.get("target_time"):
        return jsonify({
            "error": "Alarm details are required"
        }), 400

    try:
        datetime.fromisoformat(data["target_time"])
    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid alarm time"
        }), 400

    conn = get_db()

    cursor = conn.execute(
        "INSERT INTO alarms (label, target_time) VALUES (?, ?)",
        (data["label"], data["target_time"])
    )

    conn.commit()

    alarm_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Alarm saved successfully!",
        "id": alarm_id
    }), 201


# Delete alarm
@app.route("/api/alarms/<int:alarm_id>", methods=["DELETE"])
def delete_alarm(alarm_id):

    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM alarms WHERE id = ?",
        (alarm_id,)
    )

    conn.commit()

    deleted = cursor.rowcount

    conn.close()

    if deleted == 0:
        return jsonify({
            "error": "Alarm not found"
        }), 404

    return jsonify({
        "message": "Alarm deleted successfully!"
    })


# Initialize database
init_db()


# Run application locally
if __name__ == "__main__":
    app.run(debug=True)
