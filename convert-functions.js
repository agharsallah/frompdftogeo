
CMS_INCH = 2.54;    /* cms/inch */
METERS_FOOT = 0.3048;     /* meters/foot */
METERS_NMILE = 1852.0;    /* meters/nautical mile */
METERS_FATHOM = 1.8288;   /* meters/fathom (straight conversion) */
UMETERS_UFATHOM = 1.8750;   /* unc mtrs/unc fthm - accounts for */
        /* snd vel of 1500m/sec to 800fm/sec */
PI = 3.1415927;
TWO_PI = 6.2831854;  
RTOD =57.29577951308232; 
DTOR =(1.0/RTOD); 
RADIANS = 57.2957795;     /* degrees/radian */
SECS_HOUR = 3600; 
/* coordinate translation options */
XY_TO_LL= 1;
LL_TO_XY= 2;
LL_TO_LL= 3;

/* coordinate system types  */
GPS_COORDS_WGS84 = 1;
GPS_COORDS_C1866 = 2;
LORANC_COORDS = 3;
SURVEY_COORDS = 4;
TRANSIT_COORDS = 5;

RADIUS = 6378137.0;
FLATTENING = 0.00335281068; /* GRS80 or WGS84 */
K_NOT = 0.9996;     /* UTM scale factor */
DEGREES_TO_RADIANS = 0.01745329252;
FALSE_EASTING = 500000.0;
FALSE_NORTHING = 10000000.0;

/*from UTM to World system */
var proj4 = require('proj4');
var FromProjXY = '+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs';
var ToProjLatLong = '+proj=longlat +datum=WGS84 +no_defs ';

function DEG_TO_RADIANS(x)
{ 
    return (x/RADIANS); 
}

function RAD_TO_DEGREES(x)
{  
    return (x*RADIANS);   /* radians (a) to degrees */
}

function DEGMIN_TO_DECDEG(x,y)
{
    return (x + y/60.0);  /* deg,min to decimal degrees */
}

function DEGMIN_TO_SECS(x,y)
{
    return ((x*3600.0)+(y*60.0)); /* deg,min to seconds */

}

function MSEC_TO_KNOTS(x)
{ 
    return ((x/METERS_NMILE)*SECS_HOUR); 
} 

function KNOTS_TO_MSEC(x)
{
    return ((x*METERS_NMILE)/SECS_HOUR); 
}

function FEET_TO_METERS(x)
{
    return (X * METERS_FOOT); 
}

function deg_min_2_deg(deg,dec_min)
{
    /* convert deg and min to decimal degrees */
    dec_deg = deg*1 + (dec_min/60.0);

    return (dec_deg);
}

function deg_min_sec_2_deg(deg,min,sec)
{ 
    dec_deg = deg*1.0 + (min/60.0) +(sec/3600.0);
    return (dec_deg);
}


function deg_2_deg_min (x)
{
  with(Math)
  {
    whole_deg = floor(abs(x))*((x > 0.0) ? 1.0 : -1.0);
    dec_min = (60.0*(x - (whole_deg)));

    if (dec_min.toFixed(4) >=60)
    {
          dec_min=0;
          whole_deg=whole_deg + 1;
    }
    dm={};
    dm={deg:whole_deg,min:dec_min};
    return(dm);
  }
}

function METERS_DEGLON(x)
{  
   with (Math)
   {
      var d2r=DEG_TO_RADIANS(x);
      return((111415.13 * cos(d2r))- (94.55 * cos(3.0*d2r)) + (0.12 * cos(5.0*d2r)));
   }
}

function METERS_DEGLAT(x)
{
   with (Math)
   {
      var d2r=DEG_TO_RADIANS(x);
      return(111132.09 - (566.05 * cos(2.0*d2r))+ (1.20 * cos(4.0*d2r)) - (0.002 * cos(6.0*d2r)));
   }
}


/*----------------------------------------------------------
#   The following functions are modified from the origin
#   C functions created by Louis Whitcomb 19 Jun 2001
 ---------------------------------------------------------*/
/*----------------------------------------------------------
#   translate_coordinates
#   routine to translate between geographic and cartesian coordinates
#   user must supply following data on the cartesian coordinate system:
#   location of the origin in lat/lon degrees;
#   rotational skew from true north in degrees;
#   N.B. sense of rotation i/p here is exactly as o/p by ORIGIN
#   x/y offset in meters - only if an offset was used during the
#   running of prog ORIGIN;
*/

function translate_coordinates(trans_option,porg)
{
   with(Math)
   {   
      var xx,yy,r,ct,st,angle;
      angle = DEG_TO_RADIANS(porg.rotation_angle_degs);

      if( trans_option == XY_TO_LL)
      {
         /* X,Y to Lat/Lon Coordinate Translation  */
         pxpos_mtrs = porg.x;  
         pypos_mtrs = porg.y;
   xx = pxpos_mtrs - porg.xoffset_mtrs;
   yy = pypos_mtrs - porg.yoffset_mtrs;
   r = sqrt(xx*xx + yy*yy);

   if(r)
   {
            ct = xx/r;
      st = yy/r;
      xx = r * ( (ct * cos(angle))+ (st * sin(angle)) );
      yy = r * ( (st * cos(angle))- (ct * sin(angle)) );
   }

   var plon = porg.olon + xx/METERS_DEGLON(olat);
   var plat = porg.olat + yy/METERS_DEGLAT(olat);

         var sll={};
         sll={slat:plat, slon:plon};
         return(sll);
      }
      else if(trans_option == LL_TO_XY)
      {
         xx = (porg.slon - porg.olon)*METERS_DEGLON(porg.olat);
   yy = (porg.slat - porg.olat)*METERS_DEGLAT(porg.olat);

  r = sqrt(xx*xx + yy*yy);

        /* alert('LL_TO_XY: xx=' + xx + ' yy=' + yy + ' r=' + r);
        return false;*/

  if(r)
  {
      ct = xx/r;
            st = yy/r;
      xx = r * ( (ct * cos(angle)) + (st * sin(angle)) );
      yy = r * ( (st * cos(angle)) - (ct * sin(angle)) );
  }
  pxpos_mtrs = xx + porg.xoffset_mtrs;
  pypos_mtrs = yy + porg.yoffset_mtrs;
      
        var sxy={};
        sxy={x:pxpos_mtrs, y:pypos_mtrs};

        return(sxy);
     }
  }
}
/*-------------------------------------------------*/

function utm_zone(slat, slon)
{
   with(Math)
   {
      /* determine the zone for the given longitude 
         with 6 deg wide longitudinal strips */

      var zlon= slon + 180; /* set the lon from 0-360 */
   
      for (var i=1; i<=60; i++)
      { 
         if ( zlon >= (i-1)*6 & zlon < i*6)
         {
            break;
         }
      }
      var zone=i;

      /*  modify the zone number for special areas */
      if ( slat >=72 & (slon >=0 & slon <=36))
      {
          if (slon < 9.0)
          {
              zone= 31;
          }
          else if ( slon  >= 9.0 & slon < 21)
          {
              zone= 33;
          }
          else if ( slon >= 21.0 & slon < 33)
          {
              zone= 35;
          }
          else if ( slon  >= 33.0 & slon < 42)
          {
             zone= 37;
          }
      }
      if ( (slat >=56 & slat < 64) & (slon >=3 & slon < 12))
      {
          zone= 32;  /* extent to west ward for 3deg more */
      }
      return (zone);
    }
    return true;
}

/*-------------------------------------------------*/

function geo_utm(lat, lon, zone)
{
   with(Math)
   {
      /* first compute the necessary geodetic parameters and constants */

      lambda_not = ((-180.0 + zone*6.0) -3.0)/RADIANS ;
      e_squared = 2.0 * FLATTENING - FLATTENING*FLATTENING;
      e_fourth = e_squared * e_squared;
      e_sixth = e_fourth * e_squared;
      e_prime_sq = e_squared/(1.0 - e_squared);
      sin_phi = sin(lat);
      tan_phi = tan(lat);
      cos_phi = cos(lat);
      N = RADIUS/sqrt(1.0 - e_squared*sin_phi*sin_phi);
      T = tan_phi*tan_phi;
      C = e_prime_sq*cos_phi*cos_phi;
      M = RADIUS*((1.0 - e_squared*0.25 -0.046875*e_fourth  -0.01953125*e_sixth)*lat-
        (0.375*e_squared + 0.09375*e_fourth +
         0.043945313*e_sixth)*sin(2.0*lat) +
        (0.05859375*e_fourth + 0.043945313*e_sixth)*sin(4.0*lat) -
        (0.011393229 * e_sixth)*sin(6.0*lat));
      A = (lon - lambda_not)*cos_phi;
      A_sq = A*A;
      A_fourth =  A_sq*A_sq;
  
      /* now go ahead and compute X and Y */
  
      x_utm = K_NOT*N*(A + (1.0 - T + C)*A_sq*A/6.0 +
       (5.0 - 18.0*T + T*T + 72.0*C - 
        58.0*e_prime_sq)*A_fourth*A/120.0);
  
      /* note:  specific to UTM, vice general trasverse mercator.  
         since the origin is at the equator, M0, the M at phi_0, 
         always equals zero, and I won't compute it   */                                            
  
       y_utm = K_NOT*(M + N*tan_phi*(A_sq/2.0 + 
          (5.0 - T + 9.0*C + 4.0*C*C)*A_fourth/24.0 +
          (61.0 - 58.0*T + T*T + 600.0*C - 
           330.0*e_prime_sq)*A_fourth*A_sq/720.0));
  
       /* now correct for false easting and northing */
  
       if( lat < 0)
       {
          y_utm +=10000000.0;
       }
       x_utm +=500000;

       /* adds Java function returns */
       var utmxy={};
       utmxy={x:x_utm,y:y_utm};
       return(utmxy);
    }
    return true;
}


/*-------------------------------------------------------*/

function utm_geo(x_utm, y_utm, zone)
{
   with(Math)
   {
      /* first, subtract the false easting */
      x_utm = x_utm - FALSE_EASTING;

      /* compute the necessary geodetic parameters and constants */

      e_squared = 2.0 * FLATTENING - FLATTENING*FLATTENING;
      e_fourth = e_squared * e_squared;
      e_sixth = e_fourth * e_squared;
      oneminuse = sqrt(1.0-e_squared);  

      /* compute the footpoint latitude */

      M = y_utm/K_NOT;
      mu =M/(RADIUS*(1.0 - 0.25*e_squared - 
                  0.046875*e_fourth - 0.01953125*e_sixth));
      e1 = (1.0 - oneminuse)/(1.0 + oneminuse);
      e1sq =e1*e1;
      footpoint = mu + (1.5*e1 - 0.84375*e1sq*e1)*sin(2.0*mu) +
              (1.3125*e1sq - 1.71875*e1sq*e1sq)*sin(4.0*mu) +
              (1.57291666667*e1sq*e1)*sin(6.0*mu) +
              (2.142578125*e1sq*e1sq)*sin(8.0*mu);


      /* compute the other necessary terms */

      e_prime_sq =  e_squared/(1.0 -  e_squared);
      sin_phi = sin(footpoint);
      tan_phi = tan(footpoint);
      cos_phi = cos(footpoint);
      N = RADIUS/sqrt(1.0 - e_squared*sin_phi*sin_phi);
      T = tan_phi*tan_phi;
      Tsquared = T*T;
      C = e_prime_sq*cos_phi*cos_phi;
      Csquared = C*C;
      denom = sqrt(1.0-e_squared*sin_phi*sin_phi);
      R = RADIUS*oneminuse*oneminuse/(denom*denom*denom);
      D = x_utm/(N*K_NOT);
      Dsquared = D*D;
      Dfourth = Dsquared*Dsquared;

      lambda_not = ((-180.0 + zone*6.0) -3.0) * DEGREES_TO_RADIANS;


      /* now, use the footpoint to compute the real latitude and longitude */

      var lat = footpoint - (N*tan_phi/R)*(0.5*Dsquared - (5.0 + 3.0*T + 10.0*C - 
                           4.0*Csquared - 9.0*e_prime_sq)*Dfourth/24.0 +
                           (61.0 + 90.0*T + 298.0*C + 45.0*Tsquared -
                            252.0*e_prime_sq -
                            3.0*Csquared)*Dfourth*Dsquared/720.0);
      var lon = lambda_not + (D - (1.0 + 2.0*T + C)*Dsquared*D/6.0 +
                         (5.0 - 2.0*C + 28.0*T - 3.0*Csquared + 8.0*e_prime_sq +
                          24.0*Tsquared)*Dfourth*D/120.0)/cos_phi;

       /* adds Java function returns */
       var utmll={};
       utmll={ulat:lat,ulon:lon};
       return(utmll);
   }
   return true;
}
/*-----------------------------------------------------------
  xy2utm (call xy2ll then geo_utm for ll2utm)  
-------------------------------------------------------------*/

function xy2utm(Xcord,Ycord)
{
   with(Math)
   {
      /* get the origin lat and lon */
/*      var oll=getoll(Form);
*/      olat=33.8869;
      olon=9.5375;

     /* get the source x and y (to be converted) */
/*      if( Form.Xcord.value == "" | Form.Ycord.value == "")
      {
          alert('Enter X/Y values');
          return false;
      }
      else
      {*/
         sx=Xcord ; /* convert string to float */
         sy=Ycord;
     /* }*/

      var   origin={};

      origin={x:sx,y:sy,coord_system:1,
              olat:olat,
olon:olon,xoffset_mtrs:0,
              yoffset_mtrs:0,rotation_angle_degs:0,rms_error:0};
      
      var xy2ll = translate_coordinates(XY_TO_LL,
origin); 

      var slat=xy2ll.slat;  /* return in degrees */
      var slon=xy2ll.slon;

      var utmzone=utm_zone(slat,slon); /* take slat and slon in degrees */

      var slat_rad=DTOR*slat;  /* decimal degrees to radius */
      var slon_rad=DTOR*slon; 

      var utmxy = geo_utm(slat_rad,slon_rad,utmzone);

      /* get the results and fill in the form */
      /* check for validity of parameters */ 
      /* out side of grid */
      if( slat >=84.0 | slat < -80.0)
      {
	  utmzone="outsideGrid";
      }

      /* get the results and fill in the form */ 
 
/*      Form.UTMX.value=(utmxy.x.toFixed(1));
      Form.UTMY.value=(utmxy.y.toFixed(1));
      Form.UTMZone.value=utmzone;*/

      // console.log(utmxy.x.toFixed(1))
      //console.log(utmxy.y.toFixed(1))
    var finalCoord  = proj4(FromProjXY,ToProjLatLong,[utmxy.x.toFixed(1),utmxy.y.toFixed(1)])

     log_file.write('['+finalCoord.toString()+'], \n')

   }
   return true;
}

