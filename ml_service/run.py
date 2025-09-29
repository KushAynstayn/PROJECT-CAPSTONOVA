# run.py
# Optional script to start the app using uvicorn programmatically.
# The user can also run `fastapi dev main.py`.

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
