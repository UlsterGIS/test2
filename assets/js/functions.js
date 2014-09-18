$.fn.bootstrapSwitch.defaults.size = 'small';
$.fn.bootstrapSwitch.defaults.onColor = 'success';
//$.fn.bootstrapSwitch.defaults.offColor = 'warning';
$.fn.bootstrapSwitch.defaults.onText = "<span class='glyphicon glyphicon-ok'></span>"
$.fn.bootstrapSwitch.defaults.offText = "<span class='glyphicon glyphicon-remove'></span>"

var map, REConnectPointsLayer, SwimmingGraphicLayer;



require(["esri/map", "application/bootstrapmap", "esri/dijit/Measurement", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/graphic", "esri/symbols/PictureMarkerSymbol", "esri/renderers/UniqueValueRenderer", "esri/InfoTemplate", "dojo/on", "dojo/dom", "dojo/domReady!"], 
function(Map, BootstrapMap, Measurement, InfoTemplate, FeatureLayer, GraphicsLayer, Graphic, PictureMarkerSymbol, UniqueValueRenderer, InfoTemplate, on, dom) {
  // Create map  
  map = BootstrapMap.create("mapDiv",{
    center: [-74.242, 41.891],
    zoom: 10
  });
  
  //Add Initial Custom Basemap
  var REConnectBasemap = new esri.layers.ArcGISTiledMapServiceLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/Basemaps/REConnect/MapServer");
  map.addLayer(REConnectBasemap);
  
  InitializeSwitches();
  
  
  
  var MapPointLayersArray = ["Airport","Apiary","Apple Farm","Beach","Bird Watching","Brewery","Campground","Cartop Boat Launch","Covered Bridge","Dam","Distillery","Fall Festival","Farm Market","Farm Stand","Firetower","Fishing Access","Golf Course","Gravel Dirt Parking","High Peaks","Historic Places","HITS","Hunting","Ice-Skating","Kiosk","Lean-To","Lighthouse","Maple Sugar Farm","Nursery","Park And Ride","Paved Parking","Pool","Primitive Campsite","Pulloff","Rock Climbing","School","Ski Area","Trailer Boat Launch","Trailhead","Train Station","U-Pick Farm","Xmas Tree Farm","Waterfall","Winery"];
  
  
  var PointInfo = new InfoTemplate();
  PointInfo.setTitle("<a href='${WEBSITE}' target='_blank'>${NAME}</a>");
  var infocontent = "${GEN_AREA}<br>${DESCRIPT}"
  PointInfo.setContent(infocontent);
  
  var LineInfo = new InfoTemplate();
  LineInfo.setTitle("<a href='${WEBSITE}' target='_blank'>${NAME}</a>");
  var infocontent = "${GEN_AREA}<br>${SURFACE}<br>${DESCRIPT}"
  LineInfo.setContent(infocontent);
  
  var defaultSymbol =  new PictureMarkerSymbol('assets/img/symbols/default.png', 30, 30);  
  var PointRenderer = new UniqueValueRenderer(defaultSymbol, "TYPE");
  for (var i=0, l=MapPointLayersArray.length; i<l; i++) {
    var MapLayerImg = "assets/img/symbols/test/"+MapPointLayersArray[i]+".png"
    PointRenderer.addValue(MapPointLayersArray[i], new PictureMarkerSymbol(MapLayerImg, 30, 30));
  }
  
  measurementWidget = new esri.dijit.Measurement({map: map}, dojo.byId('measurementDiv'));
  measurementWidget.startup();
  
  RailTrailLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/1",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:true});
  RailTrailLayer.setDefinitionExpression("TYPE = 'rail trail'");
  RailTrailLayer.setInfoTemplate(LineInfo);
  map.addLayer(RailTrailLayer);
  
  // Create Feature Layers and definitions
  SwimmingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  SwimmingLayer.setDefinitionExpression("TYPE = 'pool' OR TYPE = 'beach'");
  SwimmingLayer.setRenderer(PointRenderer);
  SwimmingLayer.setInfoTemplate(PointInfo);
  map.addLayer(SwimmingLayer);
  
  
  BoatingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  BoatingLayer.setDefinitionExpression("TYPE = 'Cartop Boat Launch' OR TYPE = 'Trailer Boat Launch' OR TYPE = 'Dam'");
  BoatingLayer.setRenderer(PointRenderer);
  BoatingLayer.setInfoTemplate(PointInfo);
  map.addLayer(BoatingLayer);
  
  CampingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  CampingLayer.setDefinitionExpression("TYPE = 'Campground' OR TYPE = 'Primitive Campsite' OR TYPE = 'Lean-To'");
  CampingLayer.setRenderer(PointRenderer);
  CampingLayer.setInfoTemplate(PointInfo);
  map.addLayer(CampingLayer);
  
  RockClimbingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  RockClimbingLayer.setDefinitionExpression("TYPE = 'Rock Climbing'");
  RockClimbingLayer.setRenderer(PointRenderer);
  RockClimbingLayer.setInfoTemplate(PointInfo);
  map.addLayer(RockClimbingLayer);
  
  ParkingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  ParkingLayer.setDefinitionExpression("TYPE = 'Gravel / Dirt Parking' OR TYPE = 'Paved Parking' OR TYPE = 'Park And Ride' OR TYPE = 'Pulloff'");
  ParkingLayer.setRenderer(PointRenderer);
  ParkingLayer.setInfoTemplate(PointInfo);
  map.addLayer(ParkingLayer);
  
  TrailheadsLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  TrailheadsLayer.setDefinitionExpression("TYPE = 'Trailhead'");
  TrailheadsLayer.setRenderer(PointRenderer);
  TrailheadsLayer.setInfoTemplate(PointInfo);
  map.addLayer(TrailheadsLayer);  
  
  HikingTrailsLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/1",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  HikingTrailsLayer.setDefinitionExpression("TYPE = 'Hiking'");
  HikingTrailsLayer.setInfoTemplate(LineInfo);
  map.addLayer(HikingTrailsLayer);
  
  BikeRoutesLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/1",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  BikeRoutesLayer.setDefinitionExpression("TYPE = 'Bike Route'");
  BikeRoutesLayer.setInfoTemplate(LineInfo);
  map.addLayer(BikeRoutesLayer);
  
  CrossCountryLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/1",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  CrossCountryLayer.setDefinitionExpression("TYPE = 'Cross-Country Ski Trail'");
  CrossCountryLayer.setInfoTemplate(LineInfo);
  map.addLayer(CrossCountryLayer);
  
  ScenicBywaysLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/1",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  ScenicBywaysLayer.setDefinitionExpression("TYPE = 'Scenic Roads'");
  ScenicBywaysLayer.setInfoTemplate(LineInfo);
  map.addLayer(ScenicBywaysLayer);
  
  FishingAccessLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  FishingAccessLayer.setDefinitionExpression("TYPE = 'Fishing Access'");
  FishingAccessLayer.setRenderer(PointRenderer);
  FishingAccessLayer.setInfoTemplate(PointInfo);
  map.addLayer(FishingAccessLayer); 
  
  PublicFishingRightsLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/2",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  PublicFishingRightsLayer.setDefinitionExpression("TYPE = 'DECPFR'");
  PublicFishingRightsLayer.setInfoTemplate(PointInfo);
  map.addLayer(PublicFishingRightsLayer);

  
  BirdWatchingLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  BirdWatchingLayer.setDefinitionExpression("TYPE = 'Bird Watching'");
  BirdWatchingLayer.setRenderer(PointRenderer);
  BirdWatchingLayer.setInfoTemplate(PointInfo);
  map.addLayer(BirdWatchingLayer); 
  
  WaterfallsLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  WaterfallsLayer.setDefinitionExpression("TYPE = 'Waterfall'");
  WaterfallsLayer.setRenderer(PointRenderer);
  WaterfallsLayer.setInfoTemplate(PointInfo);
  map.addLayer(WaterfallsLayer); 
  
  NotablePeaksLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  NotablePeaksLayer.setDefinitionExpression("TYPE = 'High Peaks'");
  NotablePeaksLayer.setRenderer(PointRenderer);
  NotablePeaksLayer.setInfoTemplate(PointInfo);
  map.addLayer(NotablePeaksLayer); 
  
  LighthouseLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  LighthouseLayer.setDefinitionExpression("TYPE = 'Lighthouse'");
  LighthouseLayer.setRenderer(PointRenderer);
  LighthouseLayer.setInfoTemplate(PointInfo);
  map.addLayer(LighthouseLayer); 
  
  FiretowerLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  FiretowerLayer.setDefinitionExpression("TYPE = 'Firetower'");
  FiretowerLayer.setRenderer(PointRenderer);
  FiretowerLayer.setInfoTemplate(PointInfo);
  map.addLayer(FiretowerLayer); 
  
  CoveredBridgeLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  CoveredBridgeLayer.setDefinitionExpression("TYPE = 'Covered Bridge'");
  CoveredBridgeLayer.setRenderer(PointRenderer);
  CoveredBridgeLayer.setInfoTemplate(PointInfo);
  map.addLayer(CoveredBridgeLayer); 
  
  InfoKioskLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  InfoKioskLayer.setDefinitionExpression("TYPE = 'Kiosk'");
  InfoKioskLayer.setRenderer(PointRenderer);
  InfoKioskLayer.setInfoTemplate(PointInfo);
  map.addLayer(InfoKioskLayer);
  
  GolfCourseLayer = new FeatureLayer("http://gis.ulstercountyny.gov/arcgis/rest/services/REConnect/REConnect_Features/MapServer/0",{mode: FeatureLayer.MODE_SNAPSHOT, outFields: ["*"], visible:false});
  GolfCourseLayer.setDefinitionExpression("TYPE = 'Golf Course'");
  GolfCourseLayer.setRenderer(PointRenderer);
  GolfCourseLayer.setInfoTemplate(PointInfo);
  map.addLayer(GolfCourseLayer); 
  
  
});

{
// //Trails
// Rail Trail
// Hiking
// Bike Route
// Cross-Country Ski Trail
// Railroads
// Scenic Roads
// Apple Trail
// Wine Trail
// Farm Trail

// //Areas
// Belleayre
// DECPFR
// Federal Lands
// Historic Districts
// NYCDEP
// NYSDEC
// Protected
// State Lands
// Town Park
}

function InitializeSwitches(){
  $("[name='railtrails']").bootstrapSwitch();
  $("[name='swimming']").bootstrapSwitch();
  $("[name='boating']").bootstrapSwitch();
  $("[name='camping']").bootstrapSwitch();
  $("[name='rockclimbing']").bootstrapSwitch();
  $("[name='parking']").bootstrapSwitch();
  $("[name='trailheads']").bootstrapSwitch();
  $("[name='hikingtrails']").bootstrapSwitch();
  $("[name='bikeroutes']").bootstrapSwitch();
  $("[name='crosscountry']").bootstrapSwitch();
  $("[name='fishingaccess']").bootstrapSwitch();
  $("[name='publicrights']").bootstrapSwitch();
  $("[name='birdwatching']").bootstrapSwitch();
  $("[name='waterfalls']").bootstrapSwitch();
  $("[name='notablepeaks']").bootstrapSwitch();
  $("[name='lighthouses']").bootstrapSwitch();
  $("[name='firetowers']").bootstrapSwitch();
  $("[name='coveredbridges']").bootstrapSwitch();
  $("[name='touristinfo']").bootstrapSwitch();
  $("[name='scenicbyways']").bootstrapSwitch();
  $("[name='historicdistricts']").bootstrapSwitch();
  $("[name='golfcourses']").bootstrapSwitch();
  $('#sidbar-MapLayers').collapse('show');
}


// SWITCH FUNCTIONALITY BINDING
{
$('input[name="railtrails"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){RailTrailLayer.setVisibility(true);}
  else{RailTrailLayer.setVisibility(false);}
});

$('input[name="swimming"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){SwimmingLayer.setVisibility(true);}
  else{SwimmingLayer.setVisibility(false);}
});

$('input[name="boating"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){BoatingLayer.setVisibility(true);}
  else{BoatingLayer.setVisibility(false);}
});

$('input[name="camping"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){CampingLayer.setVisibility(true);}
  else{CampingLayer.setVisibility(false);}
});

$('input[name="rockclimbing"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){RockClimbingLayer.setVisibility(true);}
  else{RockClimbingLayer.setVisibility(false);}
});

$('input[name="parking"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){ParkingLayer.setVisibility(true);}
  else{ParkingLayer.setVisibility(false);}
});

////

$('input[name="fishingaccess"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){FishingAccessLayer.setVisibility(true);}
  else{FishingAccessLayer.setVisibility(false);}
});

$('input[name="publicrights"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){PublicFishingRightsLayer.setVisibility(true);}
  else{PublicFishingRightsLayer.setVisibility(false);}
});

$('input[name="birdwatching"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){BirdWatchingLayer.setVisibility(true);}
  else{BirdWatchingLayer.setVisibility(false);}
});

$('input[name="waterfalls"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){WaterfallsLayer.setVisibility(true);}
  else{WaterfallsLayer.setVisibility(false);}
});

$('input[name="notablepeaks"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){NotablePeaksLayer.setVisibility(true);}
  else{NotablePeaksLayer.setVisibility(false);}
});

$('input[name="lighthouses"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){LighthouseLayer.setVisibility(true);}
  else{LighthouseLayer.setVisibility(false);}
});

$('input[name="firetowers"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){FiretowerLayer.setVisibility(true);}
  else{FiretowerLayer.setVisibility(false);}
});

$('input[name="coveredbridges"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){CoveredBridgeLayer.setVisibility(true);}
  else{CoveredBridgeLayer.setVisibility(false);}
});

$('input[name="touristinfo"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){InfoKioskLayer.setVisibility(true);}
  else{InfoKioskLayer.setVisibility(false);}
});

$('input[name="historicdistricts"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){TrailheadsLayer.setVisibility(true);}
  else{TrailheadsLayer.setVisibility(false);}
});

$('input[name="golfcourses"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){GolfCourseLayer.setVisibility(true);}
  else{GolfCourseLayer.setVisibility(false);}
});

$('input[name="trailheads"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){TrailheadsLayer.setVisibility(true);}
  else{TrailheadsLayer.setVisibility(false);}
});














$('input[name="hikingtrails"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){HikingTrailsLayer.setVisibility(true);}
  else{HikingTrailsLayer.setVisibility(false);}
});

$('input[name="bikeroutes"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){BikeRoutesLayer.setVisibility(true);}
  else{BikeRoutesLayer.setVisibility(false);}
});

$('input[name="crosscountry"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){CrossCountryLayer.setVisibility(true);}
  else{CrossCountryLayer.setVisibility(false);}
});

$('input[name="scenicbyways"]').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state){ScenicBywaysLayer.setVisibility(true);}
  else{ScenicBywaysLayer.setVisibility(false);}
});



}




