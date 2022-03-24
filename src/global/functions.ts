export const delay = (ms: number) => {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export const removeZero = (str: string) => {
    const regex = new RegExp("^0+(?!$)",'g');
    
    return str.replace(/^0+/, "")
}

export const hexToDec = (str: string) => {
    var i, j, digits = [0], carry;
    for (i = 0; i < str.length; i += 1) {
        carry = parseInt(str.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}