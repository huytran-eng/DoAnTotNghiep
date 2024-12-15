export const capitalizeFirstLetter = (string) => {
    const [first, ...rest] = string;
    return first.toUpperCase() + rest.join('');
};