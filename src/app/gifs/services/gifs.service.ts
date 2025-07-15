import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}


@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() =>{
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  });


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

        //Historial
        tap(items => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLocaleLowerCase()]: items,
          }));
        })

      );

    //  .subscribe((resp) => {
    //     const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //     console.log({search: gifs});
    //   });


  }

  getHistoryGifs(query: string) {
    return this.searchHistory()[query] ??[];
  }

}
