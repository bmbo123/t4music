import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import * as fontkit from 'fontkit';
import { Decimal } from '@prisma/client/runtime/library';

interface ranktype {
  Rank: bigint;
  user_id: number;
  username: string;
  Followers: bigint;
  likes: bigint;
  'Streamed Hours': Decimal;
  Score: Decimal;
  min: string;
};
 

interface genrelist{genre: string; count: bigint};

const prisma = new PrismaClient();
interface pfpresult {v: string;};
interface pfpresult {v: string;};
interface result {v: bigint;};

function getCurrentDateFormatted(): string {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (1-12), and pad to ensure 2 digits
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  return `${month}-${year}`;
}

function getCurrentQuarter(): string {
  const qconvert : string[] = ['Q1', 'Q2', 'Q3', 'Q4']
  const month = new Date().getMonth();
  const pos = (month < 3? 0 : (month < 6? 1 : (month < 9? 2 : 3)))
  return `${qconvert[pos]}`;
}

export async function POST(req: Request) {
  try {

    const currentDate = getCurrentDateFormatted()
    const currentQuarter = getCurrentQuarter();
    const { username, user_id } = await req.json();
    console.log('username: ', username);
    console.log('user_id: ', user_id);
    const pfp: pfpresult[] = await prisma.$queryRaw`SELECT pfp as v FROM users WHERE user_id = ${user_id} `;
    
    //default
    const defaultRank: ranktype = {
      Rank: BigInt(0),                      
      user_id: user_id,                           
      username: username,                         
      Followers: BigInt(0),                 
      likes: BigInt(0),                     
      'Streamed Hours': new Decimal(0),     
      Score: new Decimal(0),                
      min: '',                     
    };

    //new PDF 
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // letters size

    //runing ignore becasue it says its a problem but it works so idk
    //@ts-expect-error: this is not cuaisng issues typescript is just for lame lamos
    pdfDoc.registerFontkit(fontkit);
    //font
    const comicSansPath = path.resolve('public/fonts/comic.ttf');
    const comicSansBytes = fs.readFileSync(comicSansPath);
    const font = await pdfDoc.embedFont(comicSansBytes);
    //background
    const imagepath = path.resolve('public/even lighter.jpg');
    const imageBytes = fs.readFileSync(imagepath);
    const image = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(image);

    
    let pfpimage;
    //profile picture
    if(pfp[0].v !== null){
      const response = await fetch(pfp[0].v);
      const pfpBytes = await response.arrayBuffer()
      pfpimage = await pdfDoc.embedJpg(new Uint8Array(pfpBytes));
    } else {

      const pfppath = "public/default_pfp.jpg";
      const pfpBytes = fs.readFileSync(pfppath);
      pfpimage = await pdfDoc.embedJpg(pfpBytes);
    };
    
    const gradientColors = [
          rgb(0, 153/255, 255/255),
          rgb(167/255, 0/255, 209/255),
          rgb(252/255, 142/255, 246/255),
          rgb(0, 0, 0),
        ];

    for (let i = 0; i < gradientColors.length; i++) {
      page.drawRectangle({
          x: 56 - (i * 2),
          y: 586 + (i * 2),
          width: 150,
          height: 150,
          borderWidth: 4,
          borderColor: gradientColors[i],
          borderOpacity: 0.55 + (i * .15),
      });
      if(i == 2){
        page.drawImage(pfpimage, {x: 50, y: 592, width: 150, height: 150});
      };
    };
    const genres: genrelist[] = await prisma.$queryRaw
      `select genre, COUNT(*) AS 'count'
        from songs 
        where genre != '' AND user_id = ${user_id}
        group by genre
        ORDER by COUNT(*) DESC 
        Limit 3;`;
    //gives top 
    console.log('genres: ',genres);
    if(genres.length !== 0){
      const genrefiltered :string[] = [genres[0].genre];
      for(let j = 1; j < genres.length; j++)
        {
          if(Number(genres[j].count) > 4){genrefiltered.push(genres[j].genre)};
        }
        console.log('genefiltered: ',genrefiltered);
    };
    
    const response : string[] = ['They need more Followers','They need more Likes','They need more Streaming Hours', "You Haven't Started yet but you're on your way"];
    const rankinfo: ranktype[] = await prisma.$queryRaw`SELECT * FROM ranking WHERE user_id = ${user_id}`;
    if(rankinfo.length == 0){rankinfo.push(defaultRank)};
    console.log('rankinfo: ',rankinfo);
    
    const resconvert : number = (rankinfo[0].min == 'follows' ? 0 :(rankinfo[0].min == 'likes'? 1 : (rankinfo[0].min == 'hours'? 2:3 )));

    page.drawText(username, { x:240, y:700, font, size: 32, });
    page.drawText(currentDate, { x: 540, y:752, size: 14, opacity:0.5});
    page.drawText('Overall Rank - ' + Number(rankinfo[0].Rank), { x:240, y:660, font, size: 20, });
    page.drawText('What you need to work on:', { x:240, y:620, font, size: 20, });
    page.drawText(response[resconvert], { x:250, y:600, font, size: 12, });

    page.drawLine({ start: { x: 50, y: 435 }, end: { x: 562, y: 435 }, thickness: 3,});
    page.drawLine({ start: { x: 306, y: 560 }, end: { x: 306, y: 310 }, thickness: 3,});
    
    const totFollows: result[] = await prisma.$queryRaw`SELECT count(*) FROM follows WHERE user_id_b = ${user_id}`;
    const totLikes: result[] = await prisma.$queryRaw`select count(*) from likes as L
      join songs as S on L.song_id = S.song_id
      where user_id = ${user_id};`;
    const totPlaylists: result[] = await prisma.$queryRaw`select count(distinct playlist_id) from playlist_songs as L
      join songs as S on L.song_id = S.song_id
      where user_id = 1;`;
    const totSH: result[] = await prisma.$queryRaw`select floor(sum(duration)/3600) from hours where user_id = 1;`;
    console.log(totFollows,totLikes,totPlaylists,totSH) // will get to this later







    page.drawText('Follows', { x:130, y:555, font, size: 20, });
    page.drawText('Total - ', { x:102, y: 525, font, size: 14, });
    page.drawText('New users in ' + currentQuarter + '- ', { x:88, y: 495, font, size: 14, });
    page.drawText('Growth %', { x:112, y: 465, font, size: 14, });

    page.drawText('Likes', { x:400, y:555, font, size: 20, });
    page.drawText('Total - ', { x:402, y: 525, font, size: 14, });
    page.drawText('New users in ' + currentQuarter + '- ', { x:408, y: 495, font, size: 14, });
    page.drawText('Growth %', { x:412, y: 465, font, size: 14, });

    page.drawText('Playlist', { x:130, y:405, font, size: 20, });
    page.drawText('Total - ', { x:102, y: 535, font, size: 14, });
    page.drawText('New users in ' + currentQuarter + '- ', { x:388, y: 505, font, size: 14, });
    page.drawText('Growth %', { x:112, y: 475, font, size: 14, });

    page.drawText('Streaming Hours', { x:360, y:405, font, size: 20, });
    page.drawText('Total - ', { x:102, y: 535, font, size: 14, });
    page.drawText('New users in ' + currentQuarter + '- ', { x:88, y: 505, font, size: 14, });
    page.drawText('Growth %', { x:112, y: 475, font, size: 14, });













    // Serialize the document to bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response with headers for a PDF download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=generated.pdf',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
