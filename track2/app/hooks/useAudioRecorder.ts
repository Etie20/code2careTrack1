import { useState, useRef, useCallback } from 'react'

interface UseAudioRecorderProps {
    onTranscriptionComplete: (text: string) => void
    language: 'fr' | 'en'
}

export const useAudioRecorder = ({ onTranscriptionComplete, language }: UseAudioRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false)
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const startRecording = useCallback(async () => {
        try {
            setError(null)

            // Demander permission microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            })

            streamRef.current = stream
            audioChunksRef.current = []

            // Créer MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            })

            mediaRecorderRef.current = mediaRecorder

            // Gérer les données audio
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            // Gérer la fin d'enregistrement
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                await transcribeAudio(audioBlob)

                // Nettoyer le stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop())
                    streamRef.current = null
                }
            }

            mediaRecorder.start(1000) // Enregistrer par chunks de 1s
            setIsRecording(true)
            setRecordingDuration(0)

            // Démarrer le compteur de durée
            intervalRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1)
            }, 1000)

        } catch (err) {
            console.error('Erreur démarrage enregistrement:', err)
            setError('Impossible d\'accéder au microphone')
            setIsRecording(false)
        }
    }, [transcribeAudio])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRecording])

    const transcribeAudio = useCallback(async (audioBlob: Blob) => {
        try {
            setIsTranscribing(true)

            const formData = new FormData()
            formData.append('audio', audioBlob, 'recording.webm')
            formData.append('language', language)

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la transcription')
            }

            const data = await response.json()

            if (data.text && data.text.trim()) {
                onTranscriptionComplete(data.text.trim())
            } else {
                setError('Aucun texte détecté dans l\'audio')
            }

        } catch (err) {
            console.error('Erreur transcription:', err)
            setError('Erreur lors de la transcription')
        } finally {
            setIsTranscribing(false)
            setRecordingDuration(0)
        }
    }, [language, onTranscriptionComplete])

    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            setRecordingDuration(0)

            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }

            // Nettoyer le stream sans transcription
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }
        }
    }, [isRecording])

    const formatDuration = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }, [])

    return {
        isRecording,
        isTranscribing,
        recordingDuration,
        error,
        startRecording,
        stopRecording,
        cancelRecording,
        formatDuration,
    }
}