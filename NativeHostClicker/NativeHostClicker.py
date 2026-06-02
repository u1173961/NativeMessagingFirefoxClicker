import sys
import json
import struct
import pyautogui
import time

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

while True:
    msg = get_message()

    if msg is None:
        break

    if msg["app_key"] and msg["type"] == "click":
        pyautogui.PAUSE = 0.1
        # track current mouse position
        x1, y1 = pyautogui.position()
        # wake mouse
        pyautogui.moveTo(x1+1, y1+1, duration=0.1)
        pyautogui.moveTo(x1, y1, duration=0.1)
        time.sleep(0.2)
        # click received coordinates
        pyautogui.click(x=msg["x"], y=msg["y"])
        # report back
        x, y = pyautogui.position()
        positionStr = 'X: ' + str(x).rjust(4) + ' Y: ' + str(y).rjust(4)
        send_message({
            "app_key status": "sent click " + positionStr
        })
        # reset mouse position
        pyautogui.moveTo(x1, y1, duration=0.2)
 
 
    
    
    
    
    
    
    
    
    
    
    
    
    