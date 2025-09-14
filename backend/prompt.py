def generate_prompt(text_input, mode, detail_level='brief'):
    """
    Generate a prompt based on user mode and detail level.

    Args:
        text_input (str): The input text.
        mode (str): 'patient' or 'doc'.
        detail_level (str, optional): 'brief' or 'long' (only for patient mode).

    Returns:
        str: The generated prompt.
    """
    if mode == 'patient_mode':
        if detail_level == 'brief':
            prompt = (
                f"Summarize the following medical information for a patient in simple, brief terms. Keep the response summary upto 10 words and potential disease/recommendation in 5 words:\n{text_input}"
            )
        elif detail_level == 'long':
            prompt = (
                f"Explain the following medical information to a patient in detail, using clear and accessible layman language. Keep the response upto 50 words and potential disease/recommendation in 10 words:\n{text_input}"
            )
        else:
            raise ValueError("For patient mode, detail_level must be 'brief' or 'long'.")
    elif mode == 'doctor_mode':
        prompt = (
            f"Provide a clinical summary in pointers of the following information for a healthcare professional:\n{text_input}"
        )
    else:
        raise ValueError("Mode must be 'patient_mode' or 'doctor_mode'.")
    return prompt