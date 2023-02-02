import React from 'react'
import ABBREVS from '@/utilities/bb-journal-abbrevs'

function capitalizeFirstLetters(str){
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

export function getAuthors(item){
  const all_authors = item.data.creators
    .map(creator => 
      `${creator.firstName?creator.firstName+" ":''}${creator.lastName||''}` || creator.name
    )
    .filter((e)=>e);
  if (all_authors.length == 0) return '';
  //first 5 items in all_authorts
  if (all_authors.length >= 6) return `${all_authors.slice(0,4).join(", ")}, et al., `;
  return `${all_authors.join(", ")}, `
}

export function getPages(item){
  const pages = item.data.pages;
  return pages.split("-")[0];
}

export function getJournal(item){
  var journal = item.data.publicationTitle;
  if (!journal) return '';
  for (const [full, abbrev] of ABBREVS) {
    journal = journal.replace(full, abbrev);
  }
  return capitalizeFirstLetters(journal);
}

function bluebookJournalArticle(item){
  const title = item.data.title;
  const volume = item.data.volume;
  const year = item.data.date;
  const journal = item.data.publicationTitle;

  return <span className="preview-span">
    <span>{getAuthors(item)}</span>
    <span style={{fontStyle:"italic"}}>{title}, </span>
    <span>{volume} </span>
    <span style={{fontVariant:"small-caps"}}>{getJournal(item)} </span>
    <span>{getPages(item)} </span>
    <span>({year})</span>
  </span>
}

function bluebookConferencePaper(item){
  const authors = item.data.creators
    .map(creator => `${creator.firstName?creator.firstName+" ":''}${creator.lastName||''}`)
    .filter((e)=>e).join(", ");
  const title = item.data.title;
  const volume = item.data.volume;
  const year = item.data.date;
  const journal = item.data.publicationTitle;

  return <span className="preview-span">
    <span>{getAuthors(item)}</span>
    <span style={{fontStyle:"italic"}}>{title}, </span>
    <span>{volume} </span>
    <span style={{fontVariant:"small-caps"}}>{journal} </span>
    <span>{getPages(item)} </span>
    <span>({year})</span>
  </span>
}

export function bluebookItem(item){
  if (item.data.itemType === "journalArticle"){
    return bluebookJournalArticle(item);
  } else if (item.data.itemType === "conferencePaper"){
    return bluebookConferencePaper(item);
  } else {
    return null;
  }
}