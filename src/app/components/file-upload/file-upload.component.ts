import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card class="upload-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>upload_file</mat-icon>
          Cargar Archivo XBRL
        </mat-card-title>
        <mat-card-subtitle>
          Arrastra y suelta tu archivo XBRL aquí o haz clic para seleccionar
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div 
          class="upload-area"
          [class.drag-over]="isDragOver"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()">
          
          <div class="upload-content">
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p class="upload-text">
              {{ isDragOver ? 'Suelta el archivo aquí' : 'Arrastra archivo XBRL o haz clic' }}
            </p>
            <p class="upload-hint">
              Formatos soportados: .xml, .xbrl
            </p>
          </div>
          
          <input 
            #fileInput
            type="file" 
            accept=".xml,.xbrl"
            (change)="onFileSelected($event)"
            style="display: none;">
        </div>
        
        <div *ngIf="selectedFile" class="file-info">
          <mat-icon>description</mat-icon>
          <span>{{ selectedFile.name }}</span>
          <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        </div>
        
        <mat-progress-bar 
          *ngIf="isProcessing" 
          mode="indeterminate"
          class="progress-bar">
        </mat-progress-bar>
      </mat-card-content>
      
      <mat-card-actions>
        <button 
          mat-raised-button 
          color="primary"
          [disabled]="!selectedFile || isProcessing"
          (click)="processFile()">
          <mat-icon>play_arrow</mat-icon>
          Procesar Archivo
        </button>
        
        <button 
          *ngIf="selectedFile"
          mat-button 
          color="warn"
          [disabled]="isProcessing"
          (click)="clearFile()">
          <mat-icon>clear</mat-icon>
          Limpiar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .upload-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #fafafa;
    }
    
    .upload-area:hover {
      border-color: #1976d2;
      background-color: #f0f8ff;
    }
    
    .upload-area.drag-over {
      border-color: #1976d2;
      background-color: #e3f2fd;
      transform: scale(1.02);
    }
    
    .upload-content {
      pointer-events: none;
    }
    
    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
      margin-bottom: 16px;
    }
    
    .upload-text {
      font-size: 18px;
      color: #333;
      margin: 8px 0;
    }
    
    .upload-hint {
      font-size: 14px;
      color: #666;
      margin: 8px 0;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
      padding: 12px;
      background-color: #e8f5e8;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }
    
    .file-size {
      color: #666;
      font-size: 14px;
    }
    
    .progress-bar {
      margin: 16px 0;
    }
    
    mat-card-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  `]
})
export class FileUploadComponent {
  @Output() fileProcessed = new EventEmitter<File>();
  
  selectedFile: File | null = null;
  isDragOver = false;
  isProcessing = false;

  constructor(private snackBar: MatSnackBar) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  private validateAndSetFile(file: File): void {
    // Validar tipo de archivo
    if (!this.isValidFileType(file)) {
      this.showError('Por favor selecciona un archivo XML o XBRL válido.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.showError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    this.selectedFile = file;
    this.showSuccess(`Archivo "${file.name}" seleccionado correctamente.`);
  }

  private isValidFileType(file: File): boolean {
    const validTypes = ['text/xml', 'application/xml'];
    const validExtensions = ['.xml', '.xbrl'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  processFile(): void {
    if (!this.selectedFile) return;
    
    this.isProcessing = true;
    
    // Simular procesamiento
    setTimeout(() => {
      this.isProcessing = false;
      this.fileProcessed.emit(this.selectedFile!);
      this.showSuccess('Archivo procesado correctamente.');
    }, 1000);
  }

  clearFile(): void {
    this.selectedFile = null;
    this.isProcessing = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
