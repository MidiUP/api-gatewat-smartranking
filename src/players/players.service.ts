import { CategoriesService } from './../categories/categories.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  constructor(private categoriesService: CategoriesService) {}

  async checkCategoryExists(idCategory: string): Promise<boolean> {
    return !!(await this.categoriesService.getCategoryById(idCategory));
  }
}
