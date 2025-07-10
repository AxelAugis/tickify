export function testStrength(value: string): number {
    let strength = 0;

    // Vérifier la présence des différents types de caractères
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasMinLength = value.length >= 8;

    if (value.length >= 1) {
        strength++;
    }

    if (hasUppercase) {
        strength++;
    }

    if (hasLowercase) {
        strength++;
    }

    if (hasSpecialChar && hasNumber) {
        strength++;
    }

    if (hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
        strength++;
    }

    return strength;
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])/;
    return emailRegex.test(email);
};

export function arePasswordsEqual(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}
