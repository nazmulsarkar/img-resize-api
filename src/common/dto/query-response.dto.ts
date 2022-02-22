export class QueryResponse<T> {
  data: T[] = [];
  success = true;
  totalCount?: number = 0;
}
