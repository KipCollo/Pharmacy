package com.kipcollo.configs;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

  // @Value("${application.security.security.jwt.expiration}")
   private long jwtExpiration = 86400 ;
  // @Value("${application.security.jwt.secret-key}")
   private String secretKey = "ABCD";

  public String generateToken(UserDetails userDetails){
     return generateToken(new HashMap<>(), userDetails);
  }

  public String generateToken(Map<String, Object> claims,UserDetails userDetails){
     return buildToken(claims, userDetails, jwtExpiration);
  }

  public String extractUsername(String token){
     return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
     final Claims claims = extractAllClaims(token);
     return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token){
     return Jwts
             .parser()
             .verifyWith(getSignInKey())
             .build()
             .parseSignedClaims(token)
             .getPayload();
  }
  private String buildToken(Map<String, Object> extraClaims,UserDetails userDetails,long jwtExpiration){
     var authorities = userDetails.getAuthorities()
                 .stream()
                 .map(GrantedAuthority::getAuthority)
                 .toList();

     return Jwts
              .builder()
              .claims(extraClaims)
              .subject(userDetails.getUsername())
              .issuedAt(new Date(System.currentTimeMillis()))
              .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
              .claim("authorities", authorities)
              .signWith(getSignInKey())
              .compact();

  }

  public boolean isTokenValid(String token,UserDetails userDetails){
     final String username = extractUsername(token);
     return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token){
     return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token){
     return extractClaim(token, Claims::getExpiration);
  }

  private SecretKey getSignInKey(){
     byte[] keyBytes = Decoders.BASE64.decode(secretKey);
     return Keys.hmacShaKeyFor(keyBytes);
  }


}
