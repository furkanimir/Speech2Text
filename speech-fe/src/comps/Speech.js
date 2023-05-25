import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState, useEffect } from 'react';

function Speech() {

    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);

    //bir butonda iki fonksiyon çalışması için
    const ikiFunc = async () => {
        setLoading(true);
        await handleSubmit();
        await fetchData();
        setLoading(false);
    }

    //fetchData'nın her yenilenmesinde hook atmak için
    useEffect(() => {
        fetchData();
    }, []);

    //be'den veri çekiyor
    const fetchData = async () => {
        try {
            const response = await fetch('/api/data');
            const json = await response.json();
            setData(json.chat_response);
        } catch (error) {
            console.error('Veri getirme hatasi:', error);
        }
    };

    // 'text/plain'
    //be'ye veri postluyor
    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: transcript })
            });

            if (response.ok) {
                console.log('Veri gönderildi!');
            } else {
                console.error('Veri gönderme hatasi:', response.statusText);
            }
        } catch (error) {
            console.error('Veri gönderme hatasi:', error);
        }
    };


    //SpeechRecognition dökümantasyonu
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="container">
            <div className="left">
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={SpeechRecognition.startListening}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                {/* <button onClick={deneme}>konsola ''</button> */}
                <p>{transcript}</p>
                <br />
                {/* <button onClick={handleSubmit}> handleSub:post </button>
                <button onClick={fetchData}> fetch: get</button> */}
                <button onClick={ikiFunc}> Veriyi Gönder </button>


            </div>
            <div className="right">
                <p>{loading ? 'loading ...' : data}</p>
            </div>
        </div>

    );
};
export default Speech;
