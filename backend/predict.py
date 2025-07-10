import os
import sys
import cv2
import numpy as np
import json
from tensorflow.keras.models import load_model

# --------- Load model ---------
model_path = "C:/Users/Atish/Downloads/AI/Deep Learning/DeepFake/deepfake_temporal_model.h5"
model = load_model(model_path)

# --------- Frame Extraction Function ---------
def extract_frames_from_video(video_path, output_size=(64, 64), max_frames=30):
    cap = cv2.VideoCapture(video_path)
    frames = []
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret or count >= max_frames:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, output_size)
        normalized = resized / 255.0
        frames.append(normalized)
        count += 1

    cap.release()

    # Pad if less than max_frames
    while len(frames) < max_frames:
        frames.append(np.zeros(output_size))

    return np.array(frames)

# --------- Handle Input Video from CLI ---------
if len(sys.argv) < 2:
    result = {"error": "No video path provided"}
    print(json.dumps(result))
    sys.exit(1)

video_path = sys.argv[1]

if not os.path.exists(video_path):
    result = {"error": f"Video file not found: {video_path}"}
    print(json.dumps(result))
    sys.exit(1)

# --------- Prediction ---------
frames = extract_frames_from_video(video_path)
input_data = np.expand_dims(frames, axis=0)  # shape: (1, 30, 64, 64)

prediction = model.predict(input_data)
score = prediction[0][0]

if score > 0.5:
    label = "Real"
    confidence = score * 100
else:
    label = "Fake"
    confidence = (1 - score) * 100

# --------- Output as JSON ---------
result = {
    "label": label,
    "confidence": round(float(confidence), 2),
    "score": round(float(score), 4),
    "video": os.path.basename(video_path)
}

print(json.dumps(result))
