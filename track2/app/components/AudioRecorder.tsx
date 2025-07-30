"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Mic,
    Square,
    X,
    Loader2,
    CheckCircle,
    AlertCircle,
    Volume2
} from "lucide-react"
import {useAudioRecorder} from "@/app/hooks/useAudioRecorder";

interface AudioRecorderProps {
    handleToogleTranscription: () => void
    transcriptionComplete: boolean
    transcriptionText: string,
    isTranscribing: boolean,
    onTranscriptionComplete: (text: string) => void,
    language: 'fr' | 'en',
    disabled?: boolean
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
                isTranscribing,
                transcriptionComplete,
                transcriptionText,
                handleToogleTranscription,
    onTranscriptionComplete,
    language,
    disabled = false,
                                                     }) => {
    const {
        isRecording,
        recordingDuration,
        error,
        startRecording,
        stopRecording,
        cancelRecording,
        formatDuration,
    } = useAudioRecorder({ onTranscriptionComplete, language })

    const translations = {
        fr: {
            startRecording: "Appuyez pour parler",
            stopRecording: "Arrêter l'enregistrement",
            cancel: "Annuler",
            transcribing: "Transcription en cours...",
            recording: "Enregistrement...",
            error: "Erreur d'enregistrement",
            maxDuration: "Durée maximale atteinte",
        },
        en: {
            startRecording: "Tap to speak",
            stopRecording: "Stop recording",
            cancel: "Cancel",
            transcribing: "Transcribing...",
            recording: "Recording...",
            error: "Recording error",
            maxDuration: "Maximum duration reached",
        }
    }

    const t = translations[language]

    const maxDuration = 60 // 60 secondes max
    const progress = (recordingDuration / maxDuration) * 100

    // Auto-stop à 60 secondes
    React.useEffect(() => {
        if (recordingDuration >= maxDuration && isRecording) {
            stopRecording()
        }
    }, [recordingDuration, maxDuration, isRecording, stopRecording])

    if (isTranscribing) {
        return (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 backdrop-blur-sm shadow-lg rounded-2xl">
                <div className="flex items-center gap-3 text-blue-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">{t.transcribing}</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 backdrop-blur-sm shadow-lg rounded-2xl">
                <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="ml-auto h-8 px-3 text-xs"
                    >
                        Réessayer
                    </Button>
                </div>
            </Card>
        )
    }

    if (isRecording) {
        return (
            <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 backdrop-blur-sm shadow-lg rounded-2xl">
                <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="relative">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="font-semibold">{t.recording}</span>
                        </div>
                        <div className="text-red-600 font-mono text-lg font-bold">
                            {formatDuration(recordingDuration)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <Progress
                            value={progress}
                            className="h-2 bg-red-100"
                        />
                        <div className="flex justify-between text-xs text-red-600">
                            <span>0:00</span>
                            <span>{formatDuration(maxDuration)}</span>
                        </div>
                    </div>

                    {/* Visualisation audio */}
                    <div className="flex items-center justify-center gap-1 py-2">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-red-500 rounded-full animate-pulse"
                                style={{
                                    height: `${Math.random() * 20 + 10}px`,
                                    animationDelay: `${i * 100}ms`,
                                    animationDuration: `${800 + Math.random() * 400}ms`
                                }}
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={cancelRecording}
                            className="flex items-center gap-2 bg-white/80 hover:bg-white border-red-200 text-red-600 hover:text-red-700"
                        >
                            <X className="h-4 w-4" />
                            {t.cancel}
                        </Button>
                        <Button
                            onClick={stopRecording}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                            <Square className="h-4 w-4" />
                            {t.stopRecording}
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={startRecording}
            disabled={disabled}
            className="h-12 w-12 p-0 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-blue-500 hover:to-purple-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={t.startRecording}
        >
            <Mic className="h-5 w-5" />
        </Button>
    )
}

export default AudioRecorder