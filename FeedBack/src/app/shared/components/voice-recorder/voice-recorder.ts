import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {Globe, LucideAngularModule, Mic} from 'lucide-angular';

@Component({
  selector: 'app-voice-recorder',
  imports: [
    NgClass,
    LucideAngularModule
  ],
  templateUrl: './voice-recorder.html',
  styleUrl: './voice-recorder.css'
})
export class VoiceRecorder {

  protected readonly mic = Mic;

  @Input() label: string = 'Voice Note';
  @Input() recording: boolean = false;
  @Output() recordingChange = new EventEmitter<boolean>();

  toggleRecording() {
    this.recording = !this.recording;
    this.recordingChange.emit(this.recording);
  }

  protected readonly globeIcon = Globe;
}
