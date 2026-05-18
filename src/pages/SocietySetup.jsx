import { useEffect, useState } from "react";
import axios from "axios";

import { Card, Badge, SectionTitle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import adminApi from "../api/adminApi";

const boxStyle = (active) => ({
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  border: `1.5px solid ${active ? COLORS.purple : "#E6E8F0"}`,
  background: active ? "#F4F2FF" : "#F8F9FD",
  transition: "0.2s",
});

const SocietySetup = () => {

  const [phases,setPhases] = useState([]);
  const [blocks,setBlocks] = useState([]);
  const [plots,setPlots] = useState([]);
  const [floors,setFloors] = useState([]);

  const [selectedPhase,setSelectedPhase] = useState(null);
  const [selectedBlock,setSelectedBlock] = useState(null);
  const [selectedPlot,setSelectedPlot] = useState(null);

  /* ---------------- PHASES ---------------- */

  
  /* -------------------------
      STEP 1 — LOAD PHASES
  --------------------------*/

  useEffect(()=>{
    fetchPhases();
  },[]);

  const fetchPhases = async ()=>{
    const res = await adminApi.get("/society/phase");
    setPhases(res.data.data || []);
    console.log(res);
  };

  /* -------------------------
      STEP 2 — BLOCKS
  --------------------------*/

  const handlePhaseClick = async(phase)=>{
    setSelectedPhase(phase);

    const res = await adminApi.get(`/society/blocks`,{params:{phase}});

    setBlocks(res.data);

    setPlots([]);
    setFloors([]);
  };

  /* -------------------------
      STEP 3 — PLOTS
  --------------------------*/

  const handleBlockClick = async(block)=>{

    setSelectedBlock(block);

    const res = await adminApi.get("/society/plots",{
      params:{
        phase:selectedPhase,
        block
      }
    });

    setPlots(res.data);
    setFloors([]);
  };

  /* -------------------------
      STEP 4 — FLOORS
  --------------------------*/

  const handlePlotClick = async(plot)=>{

    setSelectedPlot(plot);

    const res = await adminApi.get("/society/floors",{
      params:{
        phase:selectedPhase,
        block:selectedBlock,
        plot
      }
    });

    setFloors(res.data);
  };

  return (
    <div>

      <SectionTitle>Society Setup</SectionTitle>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:14
        }}
      >

        {/* ---------------- PHASE ---------------- */}

        <Card>
          <div style={{fontWeight:800,marginBottom:14}}>Phase</div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {phases.map(p=>(
              <div
                key={p}
                style={boxStyle(selectedPhase===p)}
                onClick={()=>handlePhaseClick(p)}
              >
                Phase {p}
              </div>
            ))}
          </div>
        </Card>


        {/* ---------------- BLOCK ---------------- */}

        <Card>
          <div style={{fontWeight:800,marginBottom:14}}>Blocks</div>

          {selectedPhase ? (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {blocks.map(b=>(
                <div
                  key={b.block}
                  style={boxStyle(selectedBlock===b.block)}
                  onClick={()=>handleBlockClick(b.block)}
                >
                  <span>Block {b.block}</span>

                  <Badge color={COLORS.purple} bg="#fff">
                    {b.occupied} Occupied
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <small>Select Phase</small>
          )}
        </Card>


        {/* ---------------- PLOT ---------------- */}

        <Card>
          <div style={{fontWeight:800,marginBottom:14}}>Plots</div>

          {selectedBlock ? (
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {plots.map(p=>(
                <div
                  key={p.plot}
                  style={boxStyle(selectedPlot===p.plot)}
                  onClick={()=>handlePlotClick(p.plot)}
                >
                  Plot {p.plot}
                  <Badge color={COLORS.amber} bg="#fff">
                    {p.occupied}/4
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <small>Select Block</small>
          )}
        </Card>


        {/* ---------------- FLOOR ---------------- */}

        <Card>
          <div style={{fontWeight:800,marginBottom:14}}>Floors</div>

          {selectedPlot ? (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {floors.map(f=>(
                <div
                  key={f.floor}
                  style={{
                    ...boxStyle(false),
                    background:f.occupied
                      ? "#FFF1F0"
                      : "#F0FFF4",
                    borderColor:f.occupied
                      ? "#FF4D4F"
                      : "#52C41A"
                  }}
                >
                  {f.floor}

                  <Badge
                    color={f.occupied ? "#FF4D4F" : "#52C41A"}
                    bg="#fff"
                  >
                    {f.occupied ? "Occupied" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <small>Select Plot</small>
          )}
        </Card>

      </div>
    </div>
  );
};

export default SocietySetup;