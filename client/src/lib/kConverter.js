
const kConverter = (number) => {

    const Knumber = (number/1000).toFixed(1);

    return `${Knumber}K`;
}

export default kConverter