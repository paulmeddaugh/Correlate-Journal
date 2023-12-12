import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { JUST_NOTEBOOK_BROWN } from "../../constants/colors";
import { getIndex, useFlubber } from "../../hooks/useFlubber";
import { useEffect, useMemo } from "react";

const colors = ['white', JUST_NOTEBOOK_BROWN];

export default function PreloadTransition ({ startingPath, endingPath, onFinishExitAnimation }) {
    const progress = useMotionValue(0);
    const paths = useMemo(() => 
        [startingPath, endingPath]
    , [startingPath, endingPath]);
    const fill = useTransform(progress, paths.map(getIndex), colors);
    const path = useFlubber(progress, paths);

    useEffect(() => {
        const animation = animate(progress, 1, {
            duration: 0.8,
            ease: "easeInOut",
            onComplete: () => {
                setTimeout(() => {
                    onFinishExitAnimation?.();
                }, 100);
            }
        });
    }, []);

    return (
        <motion.path d={path} fill={fill} />
    )
}