import { useEffect, useState } from 'react';
import styles from '../../styles/JournalWall/Line.module.css';

const POINT_DIAMETER = 18;

const Line = ({ angle = 0, length = 20, animation = true, rotateOrigin, color, dashed, pointEnd, fadeIn,
    thickness = 2 }) => {

    const [inline, setInline] = useState({
        rotate: (animation ? -(Math.PI / 2) : angle) + 'rad',
        width: length,
        left: length / 2 * Math.cos(angle) + rotateOrigin.left ?? 0,
        top: length / 2 * Math.sin(angle) + rotateOrigin.top ?? 0,
        backgroundColor: (!dashed) ? color ?? 'black' : 'unset',
        opacity: fadeIn ? 0 : 1,
        height: thickness ?? 2,
    });

    const [endPointInline, setEndPointInline] = useState({
        background: color ?? 'black',
        left: 0,
        width: POINT_DIAMETER,
        height: POINT_DIAMETER,
        top: -(POINT_DIAMETER / 2) + 1,
        opacity: (animation) ? 0 : 1,
    });

    const [originPointInline, originEndPointInline] = useState({
        background: color ?? 'black',
        left: 0,
        width: POINT_DIAMETER,
        height: POINT_DIAMETER,
        top: -(POINT_DIAMETER / 2) + 1,
    });

    useEffect(() => {
        if (fadeIn && !animation) setInline({ ...inline, opacity: 1 });
        if (animation) setTimeout(() => {
            setInline({ 
                ...inline,
                rotate: angle + 'rad',
                opacity: 1,
            });
            setEndPointInline({
                ...endPointInline,
                left: length * Math.cos(angle) - (POINT_DIAMETER / 2) + rotateOrigin.left ?? 0,
                opacity: 1,
            })
        }, 5);
    }, [])

    return (
        <div className={`${styles.line} ${(dashed) ? styles.dashed : ''}`} style={inline}>
            {!!pointEnd && <div className={styles.point} style={endPointInline} />}
            {/* {!!pointEnd && <div className={styles.point} style={originPointInline} />} */}
        </div>
    )
}

export default Line;