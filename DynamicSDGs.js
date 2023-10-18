/*
 * DynamicsSDG is drawing an SDGs logo with colors related for each SDG number you provide 
 *
 * 
 */

// --- Constants
const colors = ["#e5243b","#dda63a","#4c9f38","#c5192d","#ff3a21","#26bde2","#fcc30b","#a21942","#fd6925","#dd1367","#fd9d24","#bf8b2e","#3f7e44","#0a97d9","#56c02b","#00689d","#19486a"];
const DefaultColor = "Gainsboro";
const radiansPerUnit = (2 * Math.PI) / 17;

//--- Global variable
var SVGViewBoxSize=512;

function pieChart(inSVGViewBoxSize, inSdgs)
{
    SVGViewBoxSize=inSVGViewBoxSize;
    let startAngleRadians = -90 * Math.PI/180 ; // -90 degrees in radians to start at 12:00
    let sliceColor = DefaultColor;
    let sweepAngleRadians = null;
    let selectedSDGs = ","+inSdgs.replace(/\s/g, '')+",";

    // - def of final white circle
    const whiteCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    whiteCircle.setAttributeNS(null, 'id', 'WhiteCircle');
    whiteCircle.setAttributeNS(null, 'cx', SVGViewBoxSize/2);
    whiteCircle.setAttributeNS(null, 'cy', SVGViewBoxSize/2);
    whiteCircle.setAttributeNS(null, 'r', SVGViewBoxSize/2*0.30);
    whiteCircle.setAttributeNS(null, 'style', 'fill:#ffffff;');
    document.getElementById("svgdefs").appendChild(whiteCircle);


    // all slices
    for(let i = 0, l = 17; i < l; i++)
    {
        sweepAngleRadians = 1 * radiansPerUnit;
        valeur = i+1;
        if (selectedSDGs.includes(","+valeur+",")) {
            sliceColor=colors[i]; 
        }else {
            sliceColor=DefaultColor;
        }
        localText = { id: "svg", sdgID: i+1, centreX:SVGViewBoxSize/2, centreY: SVGViewBoxSize/2, startAngleRadians: startAngleRadians, sweepAngleRadians: sweepAngleRadians, radius: 192, fillColour: sliceColor, strokeColour: "#ffffff", strokeWidth : "5" };
        drawPieSlice(localText);

        startAngleRadians += sweepAngleRadians;
    }

    // final white circle
    let useWhiteCircle = document.createElementNS("http://www.w3.org/2000/svg", "use");
    useWhiteCircle.setAttributeNS(null, 'href',"#WhiteCircle");
    document.getElementById("svg").appendChild(useWhiteCircle);
}

function drawPieSlice(settings)
{
    let d = "";

    const firstCircumferenceX = settings.centreX + settings.radius * Math.cos(settings.startAngleRadians);
    const firstCircumferenceY = settings.centreY + settings.radius * Math.sin(settings.startAngleRadians);
    const secondCircumferenceX = settings.centreX + settings.radius * Math.cos(settings.startAngleRadians + settings.sweepAngleRadians);
    const secondCircumferenceY = settings.centreY + settings.radius * Math.sin(settings.startAngleRadians + settings.sweepAngleRadians);


    // move to centre
    d += "M" + settings.centreX + "," + settings.centreY + " ";
    // line to first edge
    d += "L" + firstCircumferenceX + "," + firstCircumferenceY + " ";
    // arc
    // Radius X, Radius Y, X Axis Rotation, Large Arc Flag, Sweep Flag, End X, End Y
    d += "A" + settings.radius + "," + settings.radius + " 0 0,1 " + secondCircumferenceX + "," + secondCircumferenceY + " ";
    // close path
    d += "Z";

    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttributeNS(null, "id", "SDG"+settings.sdgID);
    arc.setAttributeNS(null, "d", d);
    arc.setAttributeNS(null, "fill", settings.fillColour);
    arc.setAttributeNS(null, "style", "stroke:" + settings.strokeColour + ";stroke-width:" + settings.strokeWidth + ";");

    document.getElementById(settings.id+"defs").appendChild(arc);
    let useArc = document.createElementNS("http://www.w3.org/2000/svg", "use");
    useArc.setAttributeNS(null, 'href',"#SDG"+settings.sdgID);
    document.getElementById(settings.id).appendChild(useArc);

    // add SDG ID if selected
    if (settings.fillColour != DefaultColor) {
        // add SDG ID in the slice
        let textSdgID = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textSdgID.setAttributeNS(null, 'style', 'fill: #ffffff; font-family: Helvetica, Sans-Serif; font-size:36pt; font-weight:bold');
        let textPathSdgID = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
        textPathSdgID.setAttributeNS(null, 'startOffset', "50%");
        textPathSdgID.setAttributeNS(null, 'dominant-baseline', "hanging");
        textPathSdgID.setAttributeNS(null, 'text-anchor', "middle");
        textPathSdgID.setAttributeNS(null, 'side', "right");
        textPathSdgID.setAttributeNS(null, 'href', "#SDG"+settings.sdgID);
        textPathSdgID.textContent=settings.sdgID;
        textSdgID.appendChild(textPathSdgID);
        document.getElementById(settings.id).appendChild(textSdgID);
    }
}
