/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import * as XLSX from 'xlsx';


import { request } from '@strapi/helper-plugin';

const HomePage = () => {
  const [data, setData] = useState({});
  const [data_knowledge, setData_knowledge] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const response = await request("/content-manager/collection-types/api::course-order.course-order?populate=*&pageSize=100",{method: 'GET'});  
      const res = await request("/content-manager/collection-types/api::knowledge.knowledge?populate=*&pageSize=100",{method: 'GET'});
      const data = await response
      const data_knowledge = await res
      setData(data);
      setData_knowledge(data_knowledge);
    }
    fetchData();
  }, []);
  

  const check = () => {
    console.log(data_knowledge);
    const size = data_knowledge.results.length;
    for (let i = 0; i < size; i++) {
      console.log(data_knowledge.results[i].users);
    }
  }

  const exportFile = () => {
    const size = data.results.length;
    let courses = {};
    for (let i = 0; i < size; i++) {
      let username = data.results[i].user.username;
  
      for (let j = 0; j < data.results[i].courses.length; j++) {
        let courseName = data.results[i].courses[j].name;
        if (!courses[courseName]) {
          courses[courseName] = [];
        }
        if (!courses[courseName].includes(username)) {
          courses[courseName].push(username);
        }
      }
    }

    for (let courseName in courses) {
      courses[courseName].sort();
    }
  
    let result = [];
    for (let courseName in courses) {
      result.push({
        Course: courseName,
        Users: courses[courseName].join(", "),
        TotalUsers: courses[courseName].length
      });
    }
  
    result.sort((a, b) => a.Course.localeCompare(b.Course));
  

    const worksheet = XLSX.utils.json_to_sheet(result);
  
    const wscols = [
      { wch: 30 }, 
      { wch: 50 }, 
      { wch: 15 }  
    ];
    worksheet['!cols'] = wscols;
  
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if (!worksheet[cell_ref]) continue;
        
        worksheet[cell_ref].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "courses.xlsx");
  }

  const exportFile_student = () => {
    const size = data.results.length;
    const size_knowledge = data_knowledge.results.length;
    let users = {};
  
    for (let i = 0; i < size; i++) {
      let username = data.results[i].user.username;
      let email = data.results[i].user.email;
      let dateOfBirth = data.results[i].user.dateOfBirth;
      let knowledge = "";
      for (let j = 0; j < size_knowledge; j++) {
        let size_users = data_knowledge.results[j].users.length;
        for (let k = 0; k < size_users; k++) {
          if (data.results[i].user.username === data_knowledge.results[j].users[k].username) {
            knowledge = data_knowledge.results[j].name;
            break;
          } else {
            continue;
          }
        }
      }
      if (!users[username]) {
        users[username] = {
          email: email,
          dateOfBirth: dateOfBirth,
          knowledge: knowledge,
          courses: []
        };
      }
  
      for (let j = 0; j < data.results[i].courses.length; j++) {
        let courseName = data.results[i].courses[j].name;
        if (!users[username].courses.includes(courseName)) {
          users[username].courses.push(courseName);
        }
      }
    }
  
    let result = [];
    for (let username in users) {
      result.push({
        Username: username,
        Email: users[username].email,
        DateOfBirth: users[username].dateOfBirth,
        Knowledge: users[username].knowledge,
        Courses: users[username].courses.join(", ")
      });
    }
  
    result.sort((a, b) => a.Username.localeCompare(b.Username));
  
    const worksheet = XLSX.utils.json_to_sheet(result);
  
    const wscols = [
      { wch: 20 },
      { wch: 30 }, 
      { wch: 15 },
      { wch: 50 }, 
      { wch: 50 }  
    ];
    worksheet['!cols'] = wscols;
  
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if (!worksheet[cell_ref]) continue;
        
        worksheet[cell_ref].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "user.xlsx");
  };
  return (
    <div>
      <head>
        <title>Import Export</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f8fc', margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', width: '400px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Export</h1>
          <p style={{ color: '#666' }}>Export data in just few clicks</p>
          <div className="actions" style={{ marginTop: '20px' }}>
            <button onClick={exportFile} style={{ backgroundColor: '#563dff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', margin: '0 10px' }}>
              Export Course
            </button>
            <button onClick={exportFile_student} style={{ backgroundColor: '#563dff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', margin: '0 10px' }}>
              Export Student
            </button>
          </div>
        </div>
      </body>
    </div>
  );
};

export default HomePage;