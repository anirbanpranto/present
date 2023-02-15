import * as faceapi from 'face-api.js';
import React, { useState, useEffect } from 'react';
import { User } from '../types/user'
import { Button, ButtonGroup, Center, Stack, VStack, Text } from '@chakra-ui/react'
import { register } from '../utils/register';
import { predict } from '../utils/predict';
import axios from 'axios';

type props = {
    register?: boolean,
    predict?: boolean,
    user?: User
}

export const VideoCanvas = (props: props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const videoHeight = 630;
    const videoWidth = 1120;
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const [prediction, setPrediction] = useState({"fullname" : "", "email" : ""});
    const [show, setShow] = useState(false);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: { height: 630, width: 1120 } })
            .then(stream => {
                let video = videoRef.current;
                video!.srcObject = stream;
                video!.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';

            Promise.all([
                faceapi.nets.mtcnn.loadFromUri(MODEL_URL),
            ]).then(
                //@ts-ignore
                setModelsLoaded(true)
            );
        }
        loadModels();
    }, []);

    const [pause, setPause] = useState(false);
    const [cancel, setCancel] = useState(10);
    const [cancelAt, setCancelAt] = useState(10);
    const [trigger, setTrigger] = useState(false);
    const [imageBlob, setImageBlob] = useState(new Blob());
    const image = React.useRef<HTMLImageElement>(new Image());
    image.current.height = videoHeight;
    image.current.width = videoHeight;

    async function extractFaceFromBox(inputImage: any, box: any) {
        const regionsToExtract = [
            new faceapi.Rect(box.x, box.y, box.width, box.height)
        ]

        let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)

        if (faceImages.length === 0) {
            console.log('Face not found')
        }
        else {
            faceImages.forEach(cnv => {
                image.current.src = cnv.toDataURL();
                cnv.toBlob(saveBlob, "image/png");
            })
        }
    }

    const saveBlob = async (blob: Blob | null) => {
        if (blob) {
            setImageBlob(blob);
        }
    }

    const saveDB = async (email : string) => {
        await axios.post("http://localhost:8080/user/attendance/", 
        {
            "email" : email
        });
    }



    let skipModel = false;

    const ML = async () => {
        console.log(imageBlob)
        if (props.register) {
            //@ts-ignore
            register.register_user({ blob: imageBlob, user: props.user })
        }
        if (props.predict) {
            const prediction = await predict.predict_user({ blob: imageBlob })
            setPrediction(prediction);
            setShow(true);
        }
    }

    useEffect(() => {
        const timer = trigger && cancel > 0 && setInterval(() => setCancel(cancel - 1), 1000);
        if (trigger && cancel === 0) {
            ML();
        }
        //@ts-ignore
        return () => clearInterval(timer);
    }, [cancel, trigger]);

    useEffect(() => {
        const timer = show && cancelAt > 0 && setInterval(() => setCancelAt(cancelAt - 1), 1000);
        if (show && cancel === 0) {
            // ML();
            saveDB(prediction.email)
        }
        //@ts-ignore
        return () => clearInterval(timer);
    }, [cancelAt, show]);

    const handleNext = async () => {
        if (props.predict) {
            setTrigger(true);
        }

        if (props.register) {
            setTrigger(true);
        }
    }

    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (canvasRef && canvasRef.current) {
                //@ts-ignore
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current!);
                const displaySize = {
                    width: videoWidth,
                    height: videoHeight
                }
                if (!skipModel) {
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const detections = await faceapi.mtcnn(videoRef.current!, new faceapi.MtcnnOptions());
                    if (detections.length > 0) {
                        extractFaceFromBox(videoRef.current, detections[0].detection.box);
                        console.log(detections[0].detection.box);
                        videoRef.current!.pause();
                        skipModel = true;
                        setTimeout(() => {
                            setPause(true);
                        }, 2000);
                        handleNext();
                    }
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvasRef.current!.getContext('2d')!.clearRect(0, 0, videoWidth, videoHeight);
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                }
            }
        }, 1000);
    }

    const cancelCurrent = () => {
        skipModel = false;
        setPause(false);
        setTrigger(false);
        setShow(false);
        setCancel(10);
        videoRef.current?.play();
    }

    const cancelAttendance = () => {
        skipModel = false;
        setPause(false);
        setTrigger(false);
        setShow(false);
        setCancelAt(10);
        videoRef.current?.play();
    }

    return (
        <>
            <div style={{ textAlign: 'center', padding: '10px', display: pause ? "none" : "block" }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                        <video ref={videoRef || null} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', display: pause && !show ? "block" : "none" }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                        <img ref={image}></img>
                    </div>
                </div>
            </div>
            <div style={{ display: pause && cancel > 0 ? "block" : "none" }}>
                <VStack>
                    <Text as='b' fontSize="3xl">Submit this image? Cancel In {cancel}</Text>
                    <Button onClick={cancelCurrent} colorScheme='blue'>Cancel</Button>
                </VStack>
            </div>
            <div style={{ display: pause && cancel == 0 && !show ? "block" : "none" }}>
                <VStack>
                    <Text as='b' fontSize="3xl">Image Saved</Text>
                </VStack>
            </div>
            <div style={{ display: show ? "block" : "none" }}>
                <VStack>
                    <Text as='b' fontSize="3xl">Student :</Text>
                    <Text as='b' fontSize="xl">Name : {prediction.fullname}</Text>
                    <Text as='b' fontSize="xl">Email : {prediction.email}</Text>
                </VStack>
            </div>
            <div style={{ display: show && cancelAt > 0 ? "block" : "none" }}>
                <VStack>
                    <Text as='b' fontSize="3xl">Is this correct? Cancel In {cancelAt}</Text>
                    <Button onClick={cancelAttendance} colorScheme='blue'>Cancel</Button>
                </VStack>
            </div>
            <div style={{ display: show && cancelAt == 0 ? "block" : "none" }}>
                <VStack>
                    <Text as='b' fontSize="3xl">Attendance Saved</Text>
                </VStack>
            </div>
        </>
    );
}