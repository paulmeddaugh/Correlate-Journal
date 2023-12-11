const LINE_WIDTH = 2;
const CENTER_CIRCLE_RADIUS = 2;

export const svgPathFromPreloaderLines = (...lines) => {
    const centerX = window.innerWidth / 2, centerY = window.innerHeight / 2
    let pathData1 = `M${centerX} ${centerY} `, pathData2 = '';

    for (let [x1, y1, x2, y2] of lines) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const cx = centerX - CENTER_CIRCLE_RADIUS * Math.cos(angle);
        const cy = centerY - CENTER_CIRCLE_RADIUS * Math.sin(angle);
        pathData1 += `L${x1} ${y1} L${cx - 1} ${cy} `;
        pathData2 += `L${x2} ${y2} L${cx + 1} ${cy} `;
    }

    return `${pathData1}${pathData2} L${centerX} ${centerY}Z`;
}

export const scalePath = (path, scale = 1) => {
    return path
        .split(' ')
        .map(val => {
            const newVal = (() => {
            let ci; // if format `[number]C[number]`
            if ((ci = val.indexOf('C')) !== -1) {
                return val
                    .split('C')
                    .map(val => Number(val) * scale)
                    .join('C');
            }

            return (val[0] === 'M' || val[0] === 'L') 
                ? `${val[0]}${parseFloat(val.substring(1)) * scale}`
                : (parseFloat(val) * scale)
            })();
            return newVal;
        })
        .join(' ') + 'Z';
};

// const translatePath = (path, byX, byY) => {
//     return path
//         .split(' ')
//         .map(val => {
//             const newVal = (() => {
//             let ci; // if format `[number]C[number]`
//             if ((ci = val.indexOf('C')) !== -1) {
//                 return val
//                     .split('C')
//                     .map(val => Number(val) * scale)
//                     .join('C');
//             }

//             return (val[0] === 'M' || val[0] === 'L') 
//                 ? `${val[0]}${parseFloat(val.substring(1)) * scale}`
//                 : (parseFloat(val) * scale)
//             })();
//             console.log(val, newVal);
//             return newVal;
//         })
//         .join(' ') + 'Z';
// }