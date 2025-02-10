export function encryptPhone(phone) {
    return phone.slice(0, 3) + '****' + phone.slice(-4);
}

export function encryptEmail(email) {
    const index = email.indexOf('@');
    return email.slice(0,3) + '****' + email.slice(index - 1);
}
