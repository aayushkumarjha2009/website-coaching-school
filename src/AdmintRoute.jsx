import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './components/nav'
import Footer from './components/footer'
import Drafting from './admin/Drafing'
import HomeAdmin from './log'
import Sidebar from './components/sidebar'
import StudentsDashboard from './admin/Students'
import NotFoundPage from './pages/Four04'
import SyllabusEditor from './admin/Syllabus'
// <Route path="/admin/syllabus" element={<Sidebar><SyllabusEditor /></Sidebar>} />

function AdmintRoute() {
  const { id } = useParams()
  const [syllabus, setSyllabus] = useState([]);
  const [student, setstudent] = useState([]);


  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
          method: "POST", headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "aa", // or whichever student id(s) you want  // any other parameters your API expects
          })
        });
        const data = await res.json();
        setSyllabus(data || []);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_ID}/api/student`, {
          method: "POST", headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "get-students", // or whichever student id(s) you want  // any other parameters your API expects
          })
        });
        const reqe = await res.json();
        const data = reqe.data
        setstudent(data || []);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  //   useEffect(() => {
  //   const fetchSyllabus = async () => {
  //     try {
  //       const res = await fetch(`${process.env.REACT_APP_API_ID}/api/student`, {
  //         method: "POST", headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({
  //           type: "get-students", // or whichever student id(s) you want  // any other parameters your API expects
  //         })
  //       });
  //       const reqe = await res.json();
  //       const data = reqe.data
  //       setstudent(data || []);
  //     } catch (error) {
  //       console.error("Error fetching syllabus:", error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchSyllabus();
  // }, []);
  if (id === "drafting") {
    return (<><><Drafting /><Footer /></></>)
  }
  else {
    if (id === "home") {
      return (<><HomeAdmin /></>)
    }
    else if (id === "students") {
      return (<Sidebar><StudentsDashboard initialStudents={student} subjectsData={syllabus} /></Sidebar>)
    }
    else if (id === "syllabus") {
      return (<Sidebar><SyllabusEditor /></Sidebar>)
    }
    else return (
      <><Navbar /><NotFoundPage /><Footer /></>
    )
  }
}

export default AdmintRoute
