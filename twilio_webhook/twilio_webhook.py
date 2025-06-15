@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}, 200 