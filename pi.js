const base = Math.pow(10, 11)
const cell_size = Math.floor(Math.log(base) / Math.LN10)

const digits = (count, array, first_value) => {
    for(let i = 1; i < count; i++)
        array[i] = null
    array[0] = first_value
}

const is_empty = (array) => {
    for(i = 0; i < array.length; i++)
        if(array[i])
            return false
    return true
}

const add = (n, array1, array2) => {
    let carry = 0
    for(let i = n - 1; i >= 0; i--) {
        array1[i] += array2[i] + carry
        if(array1[i] < base)
            carry = 0
        else {
            carry = 1
            array1[i] = array1[i] - base
        }
    }
}

const sub = (n, array1, array2) => {
    for(let i = n - 1; i >= 0; i--) {
        array1[i] -= array2[i]
        if(array1[i] < 0) {
            if(i > 0) {
                array1[i] += base
                array1[i - 1]--
            }
        }
    }
}

const mul = (n, array1, number) => {
    let carry = 0
    for(let i = n - 1; i >= 0; i--) {
        prod = (array1[i]) * number
        prod += carry
        if(prod >= base) {
            carry = Math.floor(prod / base)
            prod -= (carry * base)
        }
        else
            carry = 0
        array1[i] = prod
    }
}

const div = (n, array1, number, array2) => {
    carry = 0
    for(let i = 0; i < n; i++) {
        const value = array1[i] + (carry * base)
        const temp = Math.floor(value / number)
        carry = value - temp * number
        array2[i] = temp
    }
}

const arctan = (angle, n, array) => {
    const angles = []
    const adivK = []
    const angle_square = angle * angle

    let k = 3
    let sign = 0

    digits(n, array, 0)
    digits(n, angles, 1)

    div(n, angles, angle, angles)
    add(n, array, angles)

    while(!is_empty(angles)) {
        div(n, angles, angle_square, angles)
        div(n, angles, k, adivK)

        if(sign)
            add(n, array, adivK)
        else
            sub(n, array, adivK)

        k += 2
        sign = 1 - sign
    }
}

const calculate = (digit_number) => {
    digit_number = +digit_number + 5

    const time_start = new Date()
    const angle = [5, 239, 0];
    const coeff = [4, -1, 0];
    const len = Math.ceil(1 + digit_number / cell_size)

    const pi_digits = []
    const arctans = []

    digits(len, pi_digits, 0)

    for(var i = 0; coeff[i] != 0; i++) {
        arctan(angle[i], len, arctans)
        mul(len, arctans, Math.abs(coeff[i]))
        if(coeff[i] > 0)
            add(len, pi_digits, arctans)
        else
            sub(len, pi_digits, arctans)
    }

    mul(len, pi_digits, 4)

    let pi = ""
    for(i = 0; i < pi_digits.length; i++) {
        if(pi_digits[i].length < cell_size && i != 0)
            while(pi_digits[i].length < cell_size)
                pi_digits[i] = "0" + pi_digits[i]
        pi += pi_digits[i]
    }

    const time_end = new Date()
    const time_taken = (time_end.getTime() - time_start.getTime()) / 1000

    console.warn(pi.startsWith("31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865"))

    console.log("PI (" + digit_number + ") = " + pi + "\n" + "It took: " + time_taken + " seconds\n")
}
