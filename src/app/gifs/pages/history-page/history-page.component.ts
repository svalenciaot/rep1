import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'history-page',
  imports: [GifListComponent],
  templateUrl: './history-page.component.html',
})
export default class HistoryPageComponent {
  gifService = inject(GifService);

  query = toSignal(inject(ActivatedRoute).params.pipe(map(params => params['query'])));

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));
 }



