import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  directoryPicker: FileSystemDirectoryHandle | null = null;
  fileHandler: FileSystemFileHandle|null = null;
  fileCreated = false;
  declareFolder() {
    try {
      if ('showOpenFilePicker' in window) {
        (window as any)
          ['showDirectoryPicker']({
            // types: [          //   {
            //     description: 'Markdown files',
            //     accept: {
            //       'text/md': ['.tx'],
            //     },
            //   },
            // ],
            multiple: false,
          })
          .then((directoryPicker: FileSystemDirectoryHandle) => {
            this.directoryPicker = directoryPicker;
          });
      } else {
        throw new Error('FEATURE NOT SUPPORTED');
      }
    } catch (error) {
      alert(error);
    }
  }

  create() {
    (window as any)
      ['showSaveFilePicker']({
        startIn: this.directoryPicker,
        suggestedName: 'fugu.txt',
        types: [
          {
            description: 'Text files',
            accept: {
              'text/txt': ['.txt'],
            },
          },
        ],
      })
      .then((fileHandle: FileSystemFileHandle) => {
        this.fileHandler = fileHandle;
        alert('File created');
      });
  }

  async update() {
    if (!this.fileHandler) return;
    const writable = await this.fileHandler.createWritable();
    await writable.write('Ciao');
    await writable.close();
  }

  async delete() {
    try {
      const pickerOpts = {
        types: [
          {
            description: 'Text',
            accept: {
              'text/*': ['.txt'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };

      const [fileHandle] = await (window as any).showOpenFilePicker(pickerOpts);
      fileHandle.remove();
      this.fileHandler = null;
    } catch (error) {
      alert('Something went wrong');
    }
  }
}
