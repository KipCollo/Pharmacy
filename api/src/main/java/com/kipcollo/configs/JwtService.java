package com.kipcollo.configs;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

   private long jwtExpiration;
   private String secretKey;

   public String generateToken(UserDetails userDetails){
      return generateToken(new HashMap<>(), userDetails);
   }

   private String generateToken(Map<String, Object> claims,UserDetails userDetails){
      return buildToken(claims, userDetails, jwtExpiration);
   }

   private String buildToken(Map<String, Object> claims,UserDetails userDetails,long jwtExpiration){
      var authorities = userDetails.getAuthorities()
                  .stream()
                  .map(GrantedAuthority::getAuthority)
                  .toList();

      return Jwts
               .builder()
               .setClaims(extraClaims)
               .setSubject(userDetails.getUsername())
               .setIssuedAt(new Date(System.currentTimeMillis()))
               .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
               .claims("authorities", authorities)
               .signWith(getSignInKey())
               .compact();
      
   }

   private Key getSignInKey(){
      byte[] keyBytes = Decoder.BASE64.decode(secretKey);
      return Keys.hmacShakeyFor(keyBytes);
   }


}
