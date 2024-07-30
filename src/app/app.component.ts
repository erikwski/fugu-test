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
  fileHandler: FileSystemFileHandle | null = null;
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

  async createCsvFilled() {
    function getRandomData() {
      return Math.random().toString(36).substring(7);
    }

    this.fileHandler = await(window as any)['showSaveFilePicker']({
      startIn: this.directoryPicker,
      suggestedName: 'fugu.csv',
      types: [
        {
          description: 'CSV File',
          accept: {
            'text/csv': ['.csv'],
          },
        },
      ],
    });
    
    // Generating three lines of random data
    const data = [
      ['Header1', 'Header2', 'Header3'],
      [getRandomData(), getRandomData(), getRandomData()],
      [getRandomData(), getRandomData(), getRandomData()],
      [getRandomData(), getRandomData(), getRandomData()],
    ];

    // Convert the data to CSV format
    const csvContent = data.map((e) => e.join(',')).join('\n');

    // Create a Blob from the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    if (!this.fileHandler) return;
    const writable = await this.fileHandler.createWritable();
    await writable.write(blob);
    await writable.close();
  }
}
