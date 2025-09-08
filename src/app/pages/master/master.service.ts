import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PaginatedResponse } from "../../interface/pagination.interface";
import { Media, MetadataResponse } from "src/app/interface/Media";
import { Actor, MediaFile } from "src/app/interface/Actor";
import { Quiz } from "src/app/interface/Quiz";


@Injectable({
  providedIn: "root",
})
export class MasterService {
  constructor(private http: HttpClient) { }


  getAllMedia(params: any): Observable<PaginatedResponse<Media>> {


    return this.http.get<any>(environment.server + `/private/media`, {
      params: params,
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(environment.access_token),
        'Content-Type': 'application/json'
      }),
    });
  }
  updateImage(id: string, formData: FormData): Observable<Media> {
    return this.http.put<Media>(
      environment.server + `/private/media/update/image/${id}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }
  uploadImage(formData: FormData): Observable<Media> {
    return this.http.post<Media>(
      environment.server + `/private/media/upload/image`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

    uploadMusicApi(formData: FormData): Observable<Media> {
    return this.http.post<Media>(
      environment.server + `/private/media/upload/audio`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }
    updateMusicApi(id: string, formData: FormData): Observable<Media> {
    return this.http.put<Media>(
      environment.server + `/private/media/update/audio/${id}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }
    getMetadataApi(): Observable<MetadataResponse> {
    return this.http.get<MetadataResponse>(
      environment.server + `/public/metadata`,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }
  deleteMedia(id: string): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(
      `${environment.server}/private/media/${id}`,
      {
         headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  addActorImage(id:number,formData: FormData): Observable<any> {
    return this.http.post<MediaFile>(
      environment.server + `/private/api/actors/${id}/gallery/images`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }
    addActorVideo(id:number,formData: FormData): Observable<any> {
    return this.http.post<MediaFile>(
      environment.server + `/private/api/actors/${id}/gallery/videos`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  getAllCastApi(params: { page: number; size: number; search?: string }): Observable<PaginatedResponse<Actor>> {
    return this.http.get<PaginatedResponse<Actor>>(
      `${environment.server}/private/api/actors`,
      {
        params,
        headers: new HttpHeaders({
          Authorization: localStorage.getItem(environment.access_token),
          'Content-Type': 'application/json'
        })
      }
    );
  }
    createActorApi(formData: FormData): Observable<Actor> {
    return this.http.post<Actor>(
      `${environment.server}/private/api/actors`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem(environment.access_token),
          'Content-Type': 'application/json'
        })
      }
    );
  }

    updateActorApi(id: number, formData: FormData): Observable<Actor> {
    return this.http.put<Actor>(
      `${environment.server}/private/api/actors/${id}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem(environment.access_token),
          'Content-Type': 'application/json'
        })
      }
    );
  }

  deleteActor(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.server}/private/api/actors/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem(environment.access_token),
          'Content-Type': 'application/json'
        })
      }
    );
  }
   getSongsCountByLanguage(): Observable<{ language: string; total: number }[]> {
    return this.http.get<{ language: string; total: number }[]>(
      `${environment.server}/public/media/songs/count-by-language`,
      {
       headers: new HttpHeaders({
          Authorization: localStorage.getItem(environment.access_token),
          'Content-Type': 'application/json'
        })
      }
    );
  }

   getAllQuestionApi(
   params:any
  ): Observable<PaginatedResponse<Quiz>> {
  
    return this.http.get<PaginatedResponse<Quiz>>(
      `${environment.server}/private/question`,
      {
        params: params,
       headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  getQuizCategories(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.server}/private/question/categories`,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  createQuiz(formData: FormData): Observable<Quiz> {
    return this.http.post<Quiz>(
      `${environment.server}/private/question`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  updateQuiz(id: string, formData: FormData): Observable<Quiz> {
    return this.http.put<Quiz>(
      `${environment.server}/private/question/${id}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }

  deleteQuiz(id: string): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(
      `${environment.server}/private/question/${id}`,
      {
         headers: new HttpHeaders({
          Authorization: "Bearer " + localStorage.getItem(environment.access_token),
        }),
      }
    );
  }









}
