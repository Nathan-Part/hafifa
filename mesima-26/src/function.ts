function isID(value: string): boolean {
    const idRegex = /^\d+$/;
    return idRegex.test(value);
}

export default isID;