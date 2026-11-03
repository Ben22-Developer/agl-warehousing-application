
const regexPattern = {
    phoneNumber: /^[+]\d{12}$/,
    email: /^[A-Z]{3,}([A-Z|0-9]*)@(gmail|yahoo)[\.](fr|com)$/i,
    word: /^[A-Z]{3,}[\w|\s]*$/i,
    sentence: /^[A-Z]{3,}[\S\s]*$/i
};

export function phoneNumberValidator(phoneNumber, errorMessage)
{
    return regexPattern.phoneNumber.test(phoneNumber) === false ? errorMessage : "";
}

export function emailValidator(email, errorMessage)
{
    return regexPattern.email.test(email) === false ? errorMessage : "";
}

export function wordValidator(word, errorMessage)
{
    return regexPattern.word.test(word) === false ? errorMessage : "";
}

export function sentenceValidator(sentence, errorMessage)
{
    return regexPattern.sentence.test(sentence) === false ? errorMessage : "";
}