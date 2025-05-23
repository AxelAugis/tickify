export function testStrength(value: string): number {
    let strength = 0;

    if (value.length >= 8) {
        strength++;
    }

    if (/[A-Z]/.test(value)) {
        if(/[a-z]/.test(value)) {
            strength++;
        }
    }

    if (/[a-z]/.test(value)) {
        if(/[A-Z]/.test(value)) {
            strength++;
        }
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        strength++;
    }

    return strength;
}
