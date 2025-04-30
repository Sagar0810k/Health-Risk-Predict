from huggingface_hub import hf_hub_download
import tensorflow as tf

def load_model():
    model_path = hf_hub_download(
        repo_id="apipyo/Cardiovascular-Disease-Detection",
        filename="Cardiovascular-Disease-Detection.keras"  # exact file name on Hugging Face
    )
    model = tf.keras.models.load_model(model_path)
    return model
