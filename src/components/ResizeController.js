import React, { useEffect } from "react";

import { useThree } from '@react-three/fiber';


export default function ResizeController() {

    const { camera } = useThree()

    const onResize = () => {
        if (window.innerWidth < 500) {
        camera.position.z = 8
        }
        else if (window.innerWidth < 700) {
        camera.position.z = 6
        }
        else if (window.innerWidth < 1000) {
        camera.position.z = 5
        }
        else if (window.innerWidth >= 1000) {
        camera.position.z = 6
        }
    }

    useEffect(() => {
        window.addEventListener("resize", onResize)
        onResize()

        return () => {
        window.removeEventListener("resize", onResize)
        }
    }, [])

    return <></>
}