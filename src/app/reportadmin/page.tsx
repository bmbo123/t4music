'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from 'react';
import InactivityTimer from "@/app/reportadmin/component/inact";
import Form from "@/app/reportadmin/component/form";
import HeaderSelection from '@/app/reportadmin/component/tableheader1';
import TableSection from '@/app/reportadmin/component/table1';
import ArtTableSection from '@/app/reportadmin/component/artistTable';
import NavBar from "@/components/ui/NavBar";
import NewSignupsTable from "./component/NewSignupsTable";
import TopListenersTable from "./component/TopListenersTable";

interface listeners {user_id: number; username: string;}
interface artists {user_id: number; username: string;}
interface albums {user_id: number; album_id: number; title: string; }
interface songs {song_id: number; title: string;}
type PassedObj = listeners | artists | albums | songs;

// Type guard to check if the object is an album
function isAlbum(obj: PassedObj): obj is albums {
  return (obj as albums).album_id !== undefined && (obj as albums).title !== undefined;
}

function isSong(obj: PassedObj): obj is songs {
  return (obj as songs).song_id !== undefined && (obj as songs).title !== undefined;
}

function isUser(obj: PassedObj): obj is listeners | artists {
  return (obj as listeners | artists).username !== undefined;
}

interface ReportData {q1: number; q2: number; q3: number; q4: number; q1_2: number; q2_2: number; total: number;}
interface CategoryData {listeners: ReportData[]; artists: ReportData[]; likes: ReportData[]; follows: ReportData[]; streaminghours: ReportData[]; uploads: ReportData[];}

const CheckboxTable: React.FC<{
  selectArr: boolean[];
  handleCheckboxChange: (index: number) => void; 
}> = ({ selectArr, handleCheckboxChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mt-10 mb-8">User print out</h2>
      <h2 className= "text-[16px] mb-8">leave blank for no users to be printed </h2>
      <table className="checkbox-table">
        <thead>
          <tr>
            <th className="text-2xl">Attribute</th>
            <th className="text-2xl px-12">Select</th>
          </tr>
        </thead>
        <tbody>
          {['User ID', 'Username', 'Email', 'Role', 'Created'].map((col, index) => (
            <tr key={index}>
              <td className="text-xl">{col}</td>
              <td className='px-20'>
                <input
                  type="checkbox"
                  checked={selectArr[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DownloadPDFButton: React.FC<{ updatedArr : boolean[]; stringArr: string[] }> = ({ updatedArr,  stringArr }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    if (stringArr[0] === '' && (stringArr[1] === '' || stringArr[2] === '' || stringArr[3] === '' || stringArr[4] === '')) {
      alert('Please make sure to select all options');
      setLoading(false);
      return;
    }
    if (stringArr[0] === '' && (stringArr[1] === '' || stringArr[2] === '' || stringArr[3] === '' || stringArr[4] === '')) {
      alert('Please make a selection');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/pdfs/admin', {
      method: 'POST',  // Assuming a POST request
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedArr, stringArr }), // Send Arrays in the request body
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'generated.pdf';
      link.click();
    } else {console.error("Failed to download PDF")};
    setLoading(false);
  };

  return (
    <div className='mt-10'>
      <Button onClick={handleDownload} disabled={loading}
      size="lg"
      variant="outline"
      className="rounded-full text-[17px] text-white border border-white/10 transition-all duration-300 hover:scale-90 
      bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"         
      >
      {loading ? 'Generating PDF...' : 'Download PDF'}
      </Button>
    </div>
  );
};

const ReportAdminPage = () => {
  const router = useRouter();
  const { role } = useUserStore();
  useEffect(() => {
    if (role !== 'admin') {
      const store = useUserStore.getState();
      store.logout();
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      router.push("/login");
    }
  }, [role, router]);

  const [arrayOfStrings, setArrayOfStrings] = useState<string[]>([]);
  const handleArrayChange = (newArray: string[]) => {
    setArrayOfStrings(newArray);
  };

  const [selectedCategory, setSelectedCategory] = useState<keyof CategoryData>('listeners');
  const [data, setData] = useState<CategoryData>({
    listeners: [],
    artists: [],
    likes: [],
    follows: [],
    streaminghours: [],
    uploads: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/adminpage/all-data');
      const result: CategoryData = await response.json();
      setData(result);
    };

    fetchData();
  }, []);


  // Initialize selectArr with 5 values (false by default)
  const [selectArr, setSelectArr] = useState([false, false, false, false, false]);
  const [listeners, setListeners] = useState<listeners[]>([]);
  const [artists, setartists] = useState<artists[]>([]);
  const [albums, setalbums] = useState<albums[]>([]);
  const [songs, setsongs] = useState<songs[]>([]);
  const [selectedobj, setSelectedobj] = useState<listeners | artists | albums | songs |null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseListeners = await fetch('/api/adminpage/listeners');
      const dataListeners: listeners[] = await responseListeners.json();
      setListeners(dataListeners); // Set the listeners data

      const responseArtists = await fetch('/api/adminpage/artists');
      const dataArtists: artists[] = await responseArtists.json();
      setartists(dataArtists); // Set the artists data

      const responseAlbums = await fetch('/api/adminpage/albums');
      const dataAlbums: albums[] = await responseAlbums.json();
      setalbums(dataAlbums); // Set the albums data

      const responseSongs = await fetch('/api/adminpage/songs');
      const dataSongs: songs[] = await responseSongs.json();
      setsongs(dataSongs); // Set the songs data
    };

    fetchData(); // Fetch the data when the component mounts
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updatedArr: boolean[] = [...selectArr];
    updatedArr[index] = !updatedArr[index]; // Toggle the value at the clicked index
    setSelectArr(updatedArr);
  };

  // Handle selecting a user
  const handleUserClick = (obj: listeners | artists | albums | songs) => {
    if (selectedobj === obj) {
      setSelectedobj(null);
    } else {
      setSelectedobj(obj); 
    }
  };

  // Handle deletion of the selected user
  const handleDeleteUser = async () => {
    if (selectedobj !== null) {
      
      if (isAlbum(selectedobj)) {
        
        const confirmed = window.confirm(`Are you sure you want to Delete ${selectedobj.title}?`);
        
        if (confirmed) {
          // Send the delete request to the server
          const response = await fetch('/api/adminpage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedobj }), // Send the selected object to delete
          });

          if (response.ok) {
            alert(`${selectedobj.title} has been removed`);

            // Clear the selected user
            setSelectedobj(null);

            // Fetch updated data after deletion
            await fetchData();
          } else {
            alert("Action Failed.");
          }
        } else {
          alert("Action canceled.");
        }
      } else if (isUser(selectedobj)) {
      
        const confirmed = window.confirm(`Are you sure you want to Delete ${selectedobj.username}?`);
        
        if (confirmed) {
          // Send the delete request to the server
          const response = await fetch('/api/adminpage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedobj }), // Send the selected object to delete
          });

          if (response.ok) {
            alert(`${selectedobj.username} has been removed`);

            // Clear the selected user
            setSelectedobj(null);

            // Fetch updated data after deletion
            await fetchData();
          } else {
            alert("Action Failed.");
          }
        } else {
          alert("Action canceled.");
        }
      } else if (isSong(selectedobj)) {

        const confirmed = window.confirm(`Are you sure you want to Delete ${selectedobj.title}?`);
        
        if (confirmed) {
          // Send the delete request to the server
          const response = await fetch('/api/adminpage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedobj }), // Send the selected object to delete
          });

          if (response.ok) {
            alert(`${selectedobj.title} has been removed`);

            // Clear the selected user
            setSelectedobj(null);

            // Fetch updated data after deletion
            await fetchData();
          } else {
            alert("Action Failed.");
          }
        } else {
          alert("Action canceled.");
        }
      }
    } else {
      alert("Please select something first.");
    }
  };

  // Fetch the updated data for listeners, artists, albums and songs after deletion
  const fetchData = async () => {
    const responseListeners = await fetch('/api/adminpage/listeners');
    const dataListeners: listeners[] = await responseListeners.json();
    setListeners(dataListeners);

    const responseArtists = await fetch('/api/adminpage/artists');
    const dataArtists: artists[] = await responseArtists.json();
    setartists(dataArtists);

    const responseAlbums = await fetch('/api/adminpage/albums');
    const dataAlbums: albums[] = await responseAlbums.json();
    setalbums(dataAlbums);

    const responseSongs = await fetch('/api/adminpage/songs');
    const dataSongs: songs[] = await responseSongs.json();
    setsongs(dataSongs);
  };
  


  return (
    <div className="min-h-screen flex flex-col bg-black">
      <NavBar role="admin"/>
      <InactivityTimer/>
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1">
        <motion.h1
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25 }}
            className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            User and Albumn controls
        </motion.h1>
      </header>
      <div className="flex space-x-10 justify-center py-20">
        <div className="w-[300px] h-[400px] overflow-y-auto border border-gray-300 p-2 px-[22px] glow-outline custom-scrollbar">
          <h3 className="text-center text-lg bg-black sticky top-0 font-bold z-10 py-2 mb-4 border glow-headers">Listeners</h3>
          <ul>
            {listeners.map((listener) => (
              <li
                key={listener.user_id}
                className={`py-1 cursor-pointer ${listener === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(listener)}
              >
                {`${listener.user_id} - ${listener.username}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[300px] h-[400px] overflow-y-auto border border-gray-300 p-2 px-[22px] glow-outline custom-scrollbar">
          <h3 className="text-center text-lg bg-black sticky top-0 font-bold z-10 py-2 mb-4 border glow-headers">Artists</h3>
          <ul>
            {artists.map((artist) => (
              <li
                key={artist.user_id}
                className={`py-1 cursor-pointer ${artist === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(artist)}
              >
                {`${artist.user_id} - ${artist.username.replace(/\./g, ' ')}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[300px] h-[400px] overflow-y-auto border border-gray-300 p-2 px-[22px] glow-outline custom-scrollbar">
          <h3 className="text-center text-lg bg-black sticky top-0 font-bold z-10 py-2 mb-4 border glow-headers">Albums</h3>
          <ul>
            {albums.map((album) => (
              <li
                key={album.album_id}
                className={`py-1 cursor-pointer ${album === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(album)}
              >
        
                {`${album.album_id} - ${album.title.slice(0, 13)}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[300px] h-[400px] overflow-y-auto border border-gray-300 p-2 px-[22px] glow-outline custom-scrollbar">
          <h3 className="text-center text-lg bg-black sticky top-0 font-bold z-10 py-2 mb-4 border glow-headers">Songs</h3>
          <ul>
            {songs.map((song) => (
              <li
                key={song.song_id}
                className={`py-1 cursor-pointer ${song === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(song)}
              >
        
                {`${song.song_id} - ${song.title.slice(0, 13)}`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-80 px-80 mb-8">
        <Button
          onClick={handleDeleteUser}
          size="lg"
          variant="outline"
          className="rounded-full text-[17px] text-2xl text-white border border-white/10 transition-all duration-300 hover:scale-90 bg-gradient-to-r from-red-500 via-red-800 to-red-800 animate-gradient"
        >
          Delete Selection
        </Button>
        <Link href="/adminupload">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-2xl px-8 text-white border border-white/20 min-w-[160px] transition-all duration-300 hover:scale-105 
            bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"
            >
            Upload
          </Button>
        </Link>
      </div>
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1 mb-10">
        <div className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient">
          Reports
        </div>
        <div className="min-h-screen flex flex-col bg-black text-white mt-20">
          <div className="flex flex-row justify-start space-x-10">
            <div className="custom-gradient-container">
              <HeaderSelection setSelectedCategory={setSelectedCategory} />
            </div>
            <div className="custom-gradient-container2">
              <TableSection selectedCategory={selectedCategory} data={data} />
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-10 mt-20">
            <div className="custom-gradient-container3">
              <ArtTableSection />
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-10 mt-12">
            <div className="custom-gradient-container3">
              <NewSignupsTable  />
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-10 mt-12">
          <div className="w-full max-w-2xl">
            <TopListenersTable />
          </div>
        </div>
        </div>
      </header>
      <div className="flex space-x-16 justify-center mb-4">

        <CheckboxTable selectArr={selectArr} handleCheckboxChange={handleCheckboxChange} />
        
        <div className="text-2xl font-semibold mt-10 mb-5">
        <Form onArrayChange={handleArrayChange}/>
        </div>
      </div>
      <div className="flex justify-center mb-12">
        <DownloadPDFButton updatedArr={selectArr} stringArr={arrayOfStrings}  />
      </div>
    </div>
  );
};

export default ReportAdminPage;

