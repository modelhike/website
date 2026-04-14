package com.example.flightmodule.flight.model;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import lombok.Data;

@Data
public class FlightInput {
  private String id;
  private Reference arrivalStation;
  private String aslot;
  private String arrivalStatus;
  private String flightKey;
}
