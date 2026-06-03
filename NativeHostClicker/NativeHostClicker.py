import sys
import json
import struct
import time
import traceback
from pathlib import Path

LOG_PATH = Path(__file__).with_name("NativeHostClicker.log")


def log(message):
    with LOG_PATH.open("a", encoding="utf-8") as log_file:
        log_file.write(time.strftime("%Y-%m-%d %H:%M:%S "))
        log_file.write(message)
        log_file.write("\n")


def get_message():
    raw_length = sys.stdin.buffer.read(4)

    if not raw_length:
        return None

    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')

    return json.loads(message)


def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('@I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def handle_click(pyautogui, msg):
    pyautogui.PAUSE = 0.1
    x = int(round(msg["x"]))
    y = int(round(msg["y"]))

    # Track current mouse position so the host can put it back afterwards.
    x1, y1 = pyautogui.position()

    # Wake mouse.
    pyautogui.moveTo(x1 + 1, y1 + 1, duration=0.1)
    pyautogui.moveTo(x1, y1, duration=0.1)
    time.sleep(0.2)

    pyautogui.click(x=x, y=y)

    current_x, current_y = pyautogui.position()
    position = "X: " + str(current_x).rjust(4) + " Y: " + str(current_y).rjust(4)
    send_message({
        "app_key status": "sent click " + position
    })

    pyautogui.moveTo(x1, y1, duration=0.2)


def main():
    log("NativeHostClicker starting")

    try:
        import pyautogui
    except Exception:
        log("Failed to import pyautogui")
        log(traceback.format_exc())
        raise

    while True:
        msg = get_message()

        if msg is None:
            log("stdin closed; exiting")
            break

        log("received message: " + json.dumps(msg))

        if msg.get("app_key") and msg.get("type") == "click":
            try:
                handle_click(pyautogui, msg)
            except Exception as error:
                log("Failed to handle click: " + str(error))
                log(traceback.format_exc())
                send_message({
                    "error": str(error)
                })
        else:
            log("ignored unexpected message")


try:
    main()
except Exception:
    log("NativeHostClicker crashed")
    log(traceback.format_exc())
    raise
