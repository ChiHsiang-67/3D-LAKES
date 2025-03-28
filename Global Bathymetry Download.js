/////////////////// This code is to download the 3D bathmytry  /////////////////////
/////////////////// Instruction ////////////////////////////////////////////////////
// 1.In line 14, change "9047" to "prefered hydrolake id".      #If you do not know hydrolake id, please visit  https://planet-test-projectchi.projects.earthengine.app/view/d-lakes
// 2 In line 14, change "GEE_exports" to your preferred folder (Optional).
// 3.Click on "Run" in the upper tab bar.
// 4.Click on "Task" in the upper right tab bar.
// 5.Click on "Run" below the "Task".
// 6.Click on "Run" in the pop-up window.
// 7.Once the task is finished, the map will be downloaded to your Google Drive in the "GEE_exports" folde

// 8.Please to search 3D-LAKES or https://planet-test-projectchi.projects.earthengine.app/view/d-lakes for more datialed information,

/////////////////// Instruction ////////////////////////////////////////////////////              
download(9047,'GEE_exports')              //    <---------- Here to change
//////////////////////////////////////////////////////////////////////////////////// 
/////////////////// Main code ////////////////////////////////////////////////////// 
function download(Hylak_id,folder){
var lakes = ee.FeatureCollection("projects/ee-chihsiang/assets/Global_Reservoir/global_A_E_v3").filter(ee.Filter.eq("Hylak_id", Hylak_id))
var featureCollection=ee.FeatureCollection('projects/sat-io/open-datasets/HydroLakes/lake_poly_v10').filter(ee.Filter.eq("Hylak_id",Hylak_id))
var Image_base=ee.Image('JRC/GSW1_4/GlobalSurfaceWater').clip(featureCollection.geometry().buffer(500))
// Chagne th str list to number list   
function string_tonumber(variable){
  var splitList = ee.String(variable).replace("\\[", "").replace("\\]", "").split(",")
  var number_list = ee.List(splitList).map(function(item) {
        return ee.Number.parse(item);})
    return number_list;
  }
var elevation = string_tonumber(lakes.aggregate_array('swo_elevation').get(0))
var swo = string_tonumber(lakes.aggregate_array('swo').get(0))
// Generate the 3D bathymetry   
var Image2=Image_base.remap(swo,elevation)
var map_ba = ui.Map.Layer(Image2, {}, 'Bathymetry');
Map.add(map_ba)
Map.centerObject(featureCollection.geometry())
// Export 
var exportParameters = {
  image: Image2, // The image to export
  description: Hylak_id, // Name of the task and resultant file (without file extension)
  scale: 30, // Resolution in meters (specific to your image's resolution)
  region: featureCollection.geometry(), // Defines the region to export, here it's the image's full extent
  fileFormat: 'GeoTIFF', // Format of the exported image, e.g., 'GeoTIFF', 'TFRecord'
  folder: folder,  //'GEE_exports', // Folder in Google Drive to store the exported image
  maxPixels: 1e12 // Maximum number of pixels to export
};
Export.image.toDrive(exportParameters);}

