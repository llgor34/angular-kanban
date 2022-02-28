import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent implements OnInit {
  customers: any;

  constructor(private seo: SeoService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.seo.generateTags({
      title: 'Customer List',
      description: 'A list filled with customers',
    });

    const colRef = collection(this.firestore, 'customers');
    this.customers = collectionData(colRef, { idField: 'id' });
  }
}
