// app/admin/page.js
"use client";

import {  useState } from "react";
import { Button } from "react-bootstrap";
import { useSupabase } from "../supabaseContext";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { Table } from "react-bootstrap";
import { format } from "date-fns";

const Page = () => {
  const {
    newsletterData,
    user,
    merch,
    guadagnoTotale,
    pezziVenduti,
    loadingMerch,
   fetchMail,
    allMail,
  } = useSupabase();
  const [messaggio, setMessaggio] = useState("");
  const [oggetto, setOggetto] = useState("");
  const [titolo, setTitolo] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [ordiniTotali, setOrdiniTotali] = useState(false);
  const [titoloMailModal, setTitoloMailModal] = useState("");
  const [oggettoMail, setOggettoMail] = useState("");
  const [messaggioMail, setMessaggioMail] = useState("");
  const [dataMail,setdataMail]=useState('')
  const [modalMail, setModalMail] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const closeOrdiniTotali = () => setOrdiniTotali(false);

  const downloadCSV = () => {
    const csvData = newsletterData.map((item) => item.email).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "newsletter_emails.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendMail = async () => {
    setShow(false);
    setLoading(true);
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newsletter: newsletterData,
        messaggio: messaggio,
        titolo: titolo,
        oggetto: oggetto,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setLoading(false);
      setMessaggio("");
      setTitolo("");
      setOggetto("");
      setEmailSent(true);

      
    } else {
      setError("invio email fallito");
      throw new Error("Login failed");
    }
    fetchMail();
  };





  const loader = (
    <svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>
  );

  const openModalMail = (mail) => {
    setModalMail(true);

    setTitoloMailModal(mail.titolo);
    setOggettoMail(mail.oggetto);
    setMessaggioMail(mail.messaggio)
    setdataMail(format(mail.created_at, "dd/MM/yyyy HH:mm"))
  };

  const closeModalMail = () => {
    setModalMail(false);
  };

  return (
    <div className="container p-3 ">
      <div className="col-4 col-lg-1">
        <Image
          src={"/Chill_Logo_Index_Black.png"}
          width={1000}
          height={1000}
          alt="sofa"
          className="titolo"
                    style={{ width: "100%", height: "auto" }}
        />
      </div>

      {user ? (
        <>
          <div className="container">
            <div className="row d-flex justify-content-center ">
              <div className="col-12 col-lg-4">
                <div className="row d-flex d-lg-grid justify-content-lg-center justify-content-between gy-5 mt-3 mb-3  ">
                  <div
                    className="col-lg-7  col-md-4 col-5 quadratoSuperiore "
                    onClick={() => setOrdiniTotali(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="row ">
                      <div className="col-12 text-center">Ordini Totali</div>
                      <div className="col-12 text-center ">
                        <h2 className="text-success ">
                          {" "}
                          {loadingMerch ? loader : merch.length}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-4 col-12 quadratoSuperiore order-3">
                    <div className="row ">
                      <div className="col-12 text-center">
                        Incasso Totale in €
                      </div>
                      <div className="col-12 text-center ">
                        <h2 className="text-success ">
                          {loadingMerch ? loader : guadagnoTotale}{" "}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-4 col-5 quadratoSuperiore">
                    <div className="row ">
                      <div className="col-12 text-center">Pezzi Venduti</div>
                      <div className="col-12 text-center ">
                        <h2 className="text-success ">
                          {loadingMerch ? loader : pezziVenduti}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-8">
                <h1>Newsletter Data</h1>
                <div className="mt-3">
                  <h6>
                    Attualmente ci sono {newsletterData.length} email registrate
                    nella nostra newsletter
                  </h6>
                  {/* <ul>
                      {newsletterData.map((item) => (
                        <li key={item.id}>{item.email}</li>
                      ))}
                    </ul> */}

                  <Button variant="dark" onClick={downloadCSV}>
                    Download CSV
                  </Button>
                </div>

                <div className="row  mt-5">
                  <div className="col-12 col-lg-12 ">
                    <h3> Componi la mail da inviare</h3>
                    <div className="row g-2">
                      <div className="row g-2 d-flex justify-content-between">
                        <div className=" col-12">
                          {" "}
                          <input
                            placeholder="Oggetto "
                            value={oggetto}
                            className="p-2"
                            onChange={(e) => setOggetto(e.target.value)}
                          
                          />
                        </div>
                        <div className=" col-12">
                          <input
                            placeholder="Titolo "
                            value={titolo}
                            className="p-2"
                            onChange={(e) => setTitolo(e.target.value)}
                          />
                        </div>

<div className="col-12 ">
                        <textarea
                          placeholder="Messaggio"
                          value={messaggio}
                          onChange={(e) => setMessaggio(e.target.value)}
                          rows={10}
                          style={{ width: "100%" }}
                          className="p-2"
                        />
                      </div>

                      </div>
                      
                      <div className="col">
                        <Button variant="dark" onClick={handleShow}>
                          Invia email
                        </Button>
                      </div>
                      {loading && <p>Invio in corso...</p>}
                      {emailSent && <p>Email inviate ! </p>}
                    </div>
                  </div>
                </div>
                <div className="col-12 outer-container mt-5">
                  <h3> Storico Newsletter</h3>
                  <div className="inner-container">
                    <Table striped bordered hover responsive variant="dark">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Data </th>
                          <th>Oggetto</th>
                          <th>Titolo</th>

                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {allMail.map((mail, index) => (
                          <tr key={index}>
                            <td>{mail.id}</td>
                            <td>
                              {format(mail.created_at, "dd/MM/yyyy HH:mm")}
                            </td>
                            <td>{mail.oggetto}</td>
                            <td>{mail.titolo}</td>

                            <td
                              onClick={() => openModalMail(mail)}
                              style={{ cursor: "pointer" }}
                            >
                              LEGGI
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={modalMail} onHide={closeModalMail} centered >
            <Modal.Header>
           <div className="row">
            <div className="col-12"><p><span style={{fontSize:'15px',color:'#ffffff50'}}>Data </span><br/>{dataMail}</p></div>
               <div className="col-12"> <p><span style={{fontSize:'15px',color:'#ffffff50'}}>Oggetto </span> <br/>{oggettoMail}</p> </div>
             <div className="col-12">   <p> <span style={{fontSize:'15px',color:'#ffffff50'}}>Titolo </span><br/>{titoloMailModal}</p> </div>
           </div>
            </Modal.Header>

            <Modal.Body>
              <div><span style={{fontSize:'15px',color:'#ffffff50'}}>Messaggio</span><br/>{messaggioMail}</div>
           <div className="text-end">
                <Button variant="secondary" onClick={closeModalMail} className="mt-5">
                  Chiudi
                </Button>
           </div>
            </Modal.Body>
         
            
             
         
          </Modal>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
              <Modal.Title>Confermi l&apos;invio della mail?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
                <li className="mt-3">
                  <b>Oggetto:</b> {oggetto}
                </li>

                <li className="mt-3">
                  <b>Titolo:</b> {titolo}
                </li>

                <li className="mt-3">
                  <b>Messaggio:</b> {messaggio}
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Chiudi
              </Button>
              <Button variant="primary" onClick={sendMail}>
                SI, invia mail
              </Button>
            </Modal.Footer>
          </Modal>

          {ordiniTotali && (
            <div className="container-fluid ordiniTotali ">
              <Modal
                show={ordiniTotali}
                onHide={closeOrdiniTotali}
                className="modal-ordiniTotali"
              >
                <Modal.Header>
                  <Modal.Title>
                    <div className="col-12">
                      {" "}
                      <p> Riepilogo ordini</p>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Header>
                  <div className="col-12">
                    <div className="row d-flex align-items-center justify-content-between">
                      <div className="col-6 text-white">
                        <h6>Ordini Totali : {merch.length}</h6>
                        <h6>Pezzi Venduti : {pezziVenduti}</h6>
                        <h6>Incasso Totale : {guadagnoTotale} € </h6>
                      </div>

                      <div className="col-6 col-md-4 col-lg-1 ">
                        <Image
                          src={"/Chill_Logo_Index_Black.png"}
                          width={1000}
                          height={1000}
                          alt="sofa"
                          className="titolo"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    </div>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <Table striped bordered hover responsive variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Data Ordine</th>
                        <th>Item</th>
                        <th>Colore</th>
                        <th>Quantità</th>
                        <th>Prezzo</th>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>Indirizzo</th>
                        <th>Contatti</th>
                        <th>Spedito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {merch.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{format(item.created_at, "dd/MM/yyyy HH:mm")}</td>
                          <td>{item.item}</td>
                          <td>{item.colore}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td>{item.name}</td>
                          <td>{item.surname}</td>
                          <td>
                            {item.via} {item.civico},{item.cap} - {item.città}
                          </td>
                          <td>
                            {item.telefono} - {item.email}
                          </td>
                          <td>{item.delivered === true ? "si" : "no"} </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeOrdiniTotali}>
                    Chiudi
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </>
      ) : (
        <p>Non sei autorizzato ad accedere a questa pagina </p>
      )}
    </div>
  );
};

export default Page;
