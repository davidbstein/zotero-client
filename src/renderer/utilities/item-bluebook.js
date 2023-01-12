import React from 'react'
import ABBREVS from './bb-journal-abbrevs'

function getAuthors(item){
  const authors = item.data.creators
    .map(creator => 
      `${creator.firstName?creator.firstName+" ":''}${creator.lastName||''}` || creator.name
    )
    .filter((e)=>e).join(", ");
  return authors?`${authors}, `:'';
}

function getPages(item){
  const pages = item.data.pages;
  return pages.split("-")[0];
}

function getJournal(item){
  var journal = item.data.publicationTitle;
  for (const [full, abbrev] of ABBREVS) {
    journal = journal.replace(full, abbrev);
  }
  return journal
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

export default function bluebookItem(item){
  if (item.data.itemType === "journalArticle"){
    return bluebookJournalArticle(item);
  } else if (item.data.itemType === "conferencePaper"){
    return bluebookConferencePaper(item);
  } else {
    return null;
  }
}