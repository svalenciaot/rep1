import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from '../../services/gifs.service';

interface MenuOption {
  label: string;
  sublabel: string;
  router: string;
  icon: string;
}


@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {
  gifService = inject(GifService);

  menuOptions:MenuOption[] = [
    {icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Gifs populares',
      router: '/dashboard/trending',
    },
    {icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscar',
      sublabel: 'Buscar gifs',
      router: '/dashboard/search',
    },

  ]
 }
