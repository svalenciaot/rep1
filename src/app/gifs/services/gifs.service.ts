import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);


  constructor() {
    this.loadTrendingGifs();
  }


  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/trending`,
      {params: {
        api_key: environment.giphyApiKey,
        limit: '20',},}
     )
     .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        console.log({gifs});
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string) {
      return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/search`,
      {params: {
        api_key: environment.giphyApiKey,
        limit: '20',
        q: query
        },
      })
      .pipe(
        map( ({data}) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      );






    //  .subscribe((resp) => {
    //     const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //     console.log({search: gifs});
    //   });


  }


}
